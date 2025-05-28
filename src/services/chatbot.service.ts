import { speechClient } from '@/api/speech.client';
import {
  chatClient,
  ChatRequest,
  ChatResponse as ApiChatResponse,
  EventResult,
} from '@/api/chat.client';

export interface ChatBotResponse {
  text: string;
  searchQuery?: string;
  suggestions?: string[];
  searchResults?: EventResult[];
  hasSearchResults?: boolean;
  timings?: {
    embedding: number;
    search: number;
    generation: number;
  };
}

// Query intent detection patterns
const LOCATION_PATTERNS = [
  /\b(ở|tại|trong|at|in)\s+([a-zA-ZÀ-ỹ\s]+)/gi,
  /\b(hà nội|hanoi|ho chi minh|hcm|tp\.?hcm|saigon|sài gòn|đà nẵng|da nang|hải phòng|hai phong|cần thơ|can tho)/gi,
];

const DATE_PATTERNS = [
  /\b(hôm nay|today|ngày mai|tomorrow|cuối tuần|weekend|tuần này|this week|tháng này|this month)/gi,
  /\b(thứ hai|monday|thứ ba|tuesday|thứ tư|wednesday|thứ năm|thursday|thứ sáu|friday|thứ bảy|saturday|chủ nhật|sunday)/gi,
  /\b(\d{1,2}\/\d{1,2}\/?\d{0,4})/g,
];

const CATEGORY_PATTERNS = [
  /\b(âm nhạc|music|concert|hòa nhạc|ca nhạc)/gi,
  /\b(triển lãm|exhibition|art|nghệ thuật)/gi,
  /\b(thể thao|sport|bóng đá|football|tennis|basketball)/gi,
  /\b(ẩm thực|food|festival|lễ hội)/gi,
  /\b(công nghệ|technology|tech|startup)/gi,
  /\b(giáo dục|education|workshop|hội thảo|seminar)/gi,
];

const PRICE_PATTERNS = [
  /\b(miễn phí|free|không mất phí|0 đồng|0đ)/gi,
  /\b(giá rẻ|cheap|affordable|budget)/gi,
];

interface QueryIntent {
  type: 'semantic' | 'structured' | 'hybrid';
  filters: {
    location?: string[];
    date?: string[];
    category?: string[];
    price?: string[];
  };
  originalQuery: string;
}

export class ChatBotService {
  private detectQueryIntent(query: string): QueryIntent {
    const intent: QueryIntent = {
      type: 'semantic',
      filters: {},
      originalQuery: query,
    };

    // Extract location filters
    const locations: string[] = [];
    LOCATION_PATTERNS.forEach((pattern) => {
      const matches = query.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          const location = match
            .replace(/\b(ở|tại|trong|at|in)\s+/gi, '')
            .trim();
          if (location) locations.push(location);
        });
      }
    });

    // Extract date filters
    const dates: string[] = [];
    DATE_PATTERNS.forEach((pattern) => {
      const matches = query.match(pattern);
      if (matches) {
        dates.push(...matches.map((m) => m.trim()));
      }
    });

    // Extract category filters
    const categories: string[] = [];
    CATEGORY_PATTERNS.forEach((pattern) => {
      const matches = query.match(pattern);
      if (matches) {
        categories.push(...matches.map((m) => m.trim()));
      }
    });

    // Extract price filters
    const prices: string[] = [];
    PRICE_PATTERNS.forEach((pattern) => {
      const matches = query.match(pattern);
      if (matches) {
        prices.push(...matches.map((m) => m.trim()));
      }
    });

    // Set filters
    if (locations.length > 0) intent.filters.location = locations;
    if (dates.length > 0) intent.filters.date = dates;
    if (categories.length > 0) intent.filters.category = categories;
    if (prices.length > 0) intent.filters.price = prices;

    // Determine query type
    const hasStructuredFilters = Object.keys(intent.filters).length > 0;
    if (hasStructuredFilters) {
      intent.type = 'hybrid';
    } else {
      intent.type = 'semantic';
    }

    return intent;
  }

  async processMessage(
    message: string,
    userId?: string,
    language: string = 'en',
  ): Promise<ChatBotResponse> {
    try {
      console.log(`Processing message: "${message}"`);

      // Detect query intent
      const intent = this.detectQueryIntent(message.toLowerCase());
      console.log('Query intent:', intent);

      // Prepare chat request
      const chatRequest: ChatRequest = {
        query: message,
        userId,
        language,
        maxResults: 5,
      };

      // Call the chat API
      const apiResponse: ApiChatResponse = await chatClient.chat(chatRequest);

      // Generate enhanced suggestions based on intent
      const suggestions = this.generateEnhancedSuggestions(
        message.toLowerCase(),
        intent,
        language,
      );

      // Convert API response to ChatBot response format
      const response: ChatBotResponse = {
        text: apiResponse.text,
        searchQuery: message,
        suggestions,
        searchResults: apiResponse.events,
        hasSearchResults: apiResponse.events.length > 0,
        timings: {
          embedding: apiResponse.query_embedding_time,
          search: apiResponse.search_time,
          generation: apiResponse.generation_time,
        },
      };

      console.log(
        `Chat response generated with ${apiResponse.events.length} events (${intent.type} search)`,
      );
      return response;
    } catch (error) {
      console.error('Chat API error:', error);

      // Fallback to a simple response
      return {
        text:
          language === 'vi'
            ? 'Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.'
            : "I'm having trouble processing your request right now. Please try again in a moment.",
        suggestions:
          language === 'vi'
            ? ['Thử lại', 'Xem tất cả sự kiện', 'Sự kiện phổ biến']
            : ['Try again', 'Browse all events', 'Popular events'],
        searchResults: [],
        hasSearchResults: false,
      };
    }
  }

  async processVoiceMessage(formData: FormData): Promise<string> {
    const result = await speechClient.speechToText(formData);
    return result.text || '';
  }

  private generateEnhancedSuggestions(
    lowerMessage: string,
    intent: QueryIntent,
    language: string,
  ): string[] {
    const isVietnamese = language === 'vi';

    // Location-based suggestions
    if (intent.filters.location) {
      return isVietnamese
        ? [
            'Sự kiện miễn phí ở Hà Nội',
            'Hòa nhạc cuối tuần',
            'Triển lãm nghệ thuật',
            'Lễ hội ẩm thực',
          ]
        : [
            'Free events in Hanoi',
            'Weekend concerts',
            'Art exhibitions',
            'Food festivals',
          ];
    }

    // Date-based suggestions
    if (intent.filters.date) {
      return isVietnamese
        ? ['Sự kiện hôm nay', 'Hoạt động cuối tuần', 'Kế hoạch phút chót']
        : ['Events today', 'Weekend activities', 'Last minute plans'];
    }

    // Category-based suggestions
    if (intent.filters.category) {
      const categories = intent.filters.category[0].toLowerCase();
      if (categories.includes('music') || categories.includes('âm nhạc')) {
        return isVietnamese
          ? [
              'Hòa nhạc trực tiếp',
              'Festival âm nhạc',
              'Buổi biểu diễn acoustic',
            ]
          : ['Live concerts', 'Music festivals', 'Acoustic performances'];
      }
      if (categories.includes('food') || categories.includes('ẩm thực')) {
        return isVietnamese
          ? ['Lễ hội ẩm thực', 'Lớp học nấu ăn', 'Nếm rượu vang']
          : ['Food festivals', 'Cooking classes', 'Wine tasting'];
      }
    }

    // Price-based suggestions
    if (intent.filters.price) {
      return isVietnamese
        ? [
            'Sự kiện miễn phí cuối tuần',
            'Hoạt động không mất phí',
            'Workshop miễn phí',
          ]
        : ['Free weekend events', 'No-cost activities', 'Free workshops'];
    }

    // Fallback to general suggestions
    return this.generateSuggestions(lowerMessage, language);
  }

  private generateSuggestions(
    lowerMessage: string,
    language: string = 'en',
  ): string[] {
    const isVietnamese = language === 'vi';

    if (lowerMessage.includes('free') || lowerMessage.includes('miễn phí')) {
      return isVietnamese
        ? [
            'Sự kiện miễn phí cuối tuần',
            'Hòa nhạc miễn phí',
            'Workshop miễn phí',
          ]
        : ['Free events this weekend', 'Free concerts', 'Free workshops'];
    }
    if (lowerMessage.includes('music') || lowerMessage.includes('âm nhạc')) {
      return isVietnamese
        ? ['Âm nhạc trực tiếp', 'Hòa nhạc tháng này', 'Festival âm nhạc']
        : ['Live music', 'Concerts this month', 'Music festivals'];
    }
    if (lowerMessage.includes('food') || lowerMessage.includes('ẩm thực')) {
      return isVietnamese
        ? ['Lễ hội ẩm thực', 'Lớp học nấu ăn', 'Nếm rượu vang']
        : ['Food festivals', 'Cooking classes', 'Wine tasting'];
    }
    if (
      lowerMessage.includes('weekend') ||
      lowerMessage.includes('cuối tuần')
    ) {
      return isVietnamese
        ? ['Sự kiện cuối tuần', 'Hoạt động thứ bảy', 'Chương trình chủ nhật']
        : ['Weekend events', 'Saturday events', 'Sunday activities'];
    }
    if (lowerMessage.includes('today') || lowerMessage.includes('hôm nay')) {
      return isVietnamese
        ? ['Sự kiện hôm nay', 'Hoạt động tối nay', 'Kế hoạch phút chót']
        : ['Events today', 'Tonight events', 'Last minute plans'];
    }

    return isVietnamese
      ? ['Sự kiện phổ biến', 'Sự kiện tuần này', 'Đề xuất cho bạn']
      : ['Popular events', 'Events this week', 'Recommended for you'];
  }
}
