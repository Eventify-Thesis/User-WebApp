import axios from 'axios';
import { getSignUrl } from '@/api/media';

export const uploadFile = async (file: File): Promise<string> => {
  try {
    // Get signed URL for uploading to S3
    const response = await getSignUrl({
      fileName: file.name,
      contentType: file.type,
      isPublic: true,
      folder: 'user/comments',
    });

    // Extract the public URL from the signed URL
    const urlObj = new URL(response.url);
    const publicUrl = `${urlObj.origin}${urlObj.pathname}`;

    // Upload the file to S3
    await axios.put(response.url, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
};
