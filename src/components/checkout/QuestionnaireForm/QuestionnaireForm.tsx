import { useResponsive } from '@/hooks/useResponsive';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetEventQuestions } from '@/queries/useGetEventQuestions';
import { Spin } from 'antd';
import { useGetFormAnswers } from '@/queries/useGetFormAnswers';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { QuestionModel } from '@/domain/QuestionModel';
import { Button, TextInput } from '@mantine/core';
import { Card } from './Card';
import { InputGroup } from './InputGroup';
import {
  CheckoutOrderQuestions,
  CheckoutTicketQuestions,
} from './CheckoutQuestion';
import { CheckoutContent } from './CheckoutContent';
import { CopyOutlined } from '@ant-design/icons';
import { TicketTypeModel } from '@/domain/TicketTypeModel';

interface FormValues {
  order: {
    first_name: string;
    last_name: string;
    email: string;
    address: Record<string, any>;
    questions: Array<{
      question_id: number;
      response: Record<string, any>;
    }>;
  };
  attendees: Array<{
    first_name: string;
    last_name: string;
    email: string;
    id: number;
    questions: Array<{
      question_id: number;
      response: Record<string, any>;
    }>;
  }>;
}

interface QuestionnaireFormProps {
  eventId: number;
  showId: number;
  bookingCode: string;
  ticketTypes: TicketTypeModel[];
  orderItems: any[];
  onSubmit: (values: any) => void;
  onFormReady?: (form: ReturnType<typeof useForm<FormValues>>) => void;
}

export const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({
  eventId,
  showId,
  bookingCode,
  ticketTypes,
  orderItems,
  onSubmit,
  onFormReady,
}) => {
  const { isTablet, isDesktop } = useResponsive();
  const { t } = useTranslation();

  const {
    data: questions,
    isLoading: isQuestionsLoading,
    isFetched: isQuestionsError,
  } = useGetEventQuestions(eventId);
  const {
    data: formAnswers,
    isLoading: isFormAnswersLoading,
    isFetched: isFormAnswersError,
  } = useGetFormAnswers(showId!, bookingCode);

  const navigate = useNavigate();
  const ticketQuestions = questions?.filter(
    (question) => question.belongsTo === 'TICKET',
  );
  const orderQuestions = questions?.filter(
    (question) => question.belongsTo === 'ORDER',
  );
  let attendeeIndex = 0;

  const form = useForm<FormValues>({
    initialValues: {
      order: {
        first_name: '',
        last_name: '',
        email: '',
        address: {},
        questions: [],
      },
      attendees: [
        {
          first_name: '',
          last_name: '',
          email: '',
          id: '',
          questions: [],
        },
      ],
    },
  });

  const copyDetailsToAllAttendees = () => {
    const updatedAttendees = form.values.attendees.map((attendee) => {
      return {
        ...attendee,
        first_name: form.values.order.first_name,
        last_name: form.values.order.last_name,
        email: form.values.order.email,
      };
    });

    form.setValues({
      ...form.values,
      attendees: updatedAttendees,
    });
  };

  const createTicketIdToQuestionMap = () => {
    const ticketIdToQuestionMap = new Map();

    ticketQuestions?.forEach((question) => {
      question.ticket_ids?.forEach((id) => {
        const existingQuestions = ticketIdToQuestionMap.get(id);
        ticketIdToQuestionMap.set(
          id,
          existingQuestions ? [...existingQuestions, question] : [question],
        );
      });
    });

    return ticketIdToQuestionMap;
  };

  const createAttendeesAndQuestions = (
    ticketIdToQuestionMap: Map<number, QuestionModel[]>,
  ) => {
    const attendees: any = [];

    orderItems?.forEach((orderItem) => {
      Array.from(Array(orderItem?.quantity)).map(() => {
        attendees.push({
          id: orderItem?.id,
          first_name: '',
          last_name: '',
          email: '',
          questions: ticketIdToQuestionMap
            .get(orderItem?.id)
            ?.map((question: QuestionModel) => {
              return {
                question_id: question.id,
                response: {},
              };
            }),
        });
      });
    });

    return attendees;
  };

  const createFormOrderQuestions = () => {
    const formOrderQuestions: any = [];

    orderQuestions?.forEach((orderQuestion) => {
      formOrderQuestions.push({
        question_id: orderQuestion.id,
        response: {},
      });
    });

    return formOrderQuestions;
  };

  useEffect(() => {
    if (
      !isQuestionsLoading &&
      !isFormAnswersLoading &&
      ticketQuestions &&
      orderQuestions
    ) {
      const attendees = createAttendeesAndQuestions(
        createTicketIdToQuestionMap(),
      );
      const formOrderQuestions = createFormOrderQuestions();

      // Initialize form with existing answers if available
      if (formAnswers?.result) {
        const { order, attendees: existingAttendees } = formAnswers.result;

        form.setValues({
          order: {
            first_name: order?.first_name || '',
            last_name: order?.last_name || '',
            email: order?.email || '',
            address: order?.address || {},
            questions: order?.questions || formOrderQuestions,
          },
          attendees: attendees.map((attendee: any, index: number) => ({
            ...attendee,
            id: existingAttendees?.[index]?.id || '',
            first_name: existingAttendees?.[index]?.first_name || '',
            last_name: existingAttendees?.[index]?.last_name || '',
            email: existingAttendees?.[index]?.email || '',
            questions:
              existingAttendees?.[index]?.questions || attendee.questions,
          })),
        });
      } else {
        form.setValues({
          ...form.values,
          attendees: attendees,
          order: {
            ...form.values.order,
            questions: formOrderQuestions,
          },
        });
      }
    }
  }, [isQuestionsLoading, isFormAnswersLoading, isQuestionsError, formAnswers]);

  if (isQuestionsLoading || isFormAnswersLoading) {
    return <Spin />;
  }

  // if (order?.payment_status === 'AWAITING_PAYMENT') {
  //   return (
  //     <HomepageInfoMessage
  //       message={t`This order is awaiting payment`}
  //       link={eventCheckoutPath(eventId, orderShortId, 'payment')}
  //       linkText={t`Complete payment`}
  //     />
  //   );
  // }

  // if (order?.status === 'COMPLETED') {
  //   return (
  //     <HomepageInfoMessage
  //       message={t`This order is complete`}
  //       link={eventCheckoutPath(eventId, orderShortId, 'summary')}
  //       linkText={t`View order details`}
  //     />
  //   );
  // }

  // if (order?.status === 'CANCELLED') {
  //   return (
  //     <HomepageInfoMessage
  //       message={t`This order has been cancelled`}
  //       link={eventHomepagePath(event as Event)}
  //       linkText={t`Go to event homepage`}
  //     />
  //   );
  // }

  // if (order?.is_expired) {
  //   navigate(`/event/${eventId}/${eventSlug}`);
  // }

  // if (isOrderError && orderError?.response?.status === 404) {
  //   return (
  //     <>
  //       <HomepageInfoMessage
  //         message={t`Sorry, this order no longer exists.`}
  //         link={eventHomepagePath(event as Event)}
  //         linkText={t`Back to event page`}
  //       />
  //     </>
  //   );
  // }

  // if (isOrderError || isEventError || isQuestionsError) {
  //   return (
  //     <>
  //       <HomepageInfoMessage
  //         message={t`Sorry, something went wrong loading this page.`}
  //         link={eventHomepagePath(event as Event)}
  //         linkText={t`Back to event page`}
  //       />
  //     </>
  //   );
  // }
  return (
    <form style={{ width: '100%' }}>
      <CheckoutContent>
        <Card>
          <InputGroup>
            <TextInput
              withAsterisk
              label={t`First Name`}
              placeholder={t`First name`}
              {...form.getInputProps('order.first_name')}
            />
            <TextInput
              withAsterisk
              label={t`Last Name`}
              placeholder={t`Last Name`}
              {...form.getInputProps('order.last_name')}
            />
          </InputGroup>

          <TextInput
            withAsterisk
            type={'email'}
            label={t`Email Address`}
            placeholder={t`Email Address`}
            {...form.getInputProps('order.email')}
          />

          {orderQuestions && (
            <CheckoutOrderQuestions form={form} questions={orderQuestions} />
          )}

          <Button
            p={0}
            ml={0}
            size={'sm'}
            variant={'transparent'}
            leftSection={<CopyOutlined />}
            onClick={copyDetailsToAllAttendees}
          >
            {t`Copy details to all attendees`}
          </Button>
        </Card>

        {orderItems?.map((orderItem) => {
          const ticket = ticketTypes?.find(
            (ticket) => ticket.id === orderItem.id,
          );

          if (!ticket) {
            return;
          }

          return (
            <div key={orderItem.ticket_id + orderItem.id}>
              <h3>{orderItem?.item_name}</h3>
              {Array.from(Array(orderItem?.quantity)).map((_, index) => {
                const attendeeInputs = (
                  <Card key={`${orderItem.id} ${index}`}>
                    <h4 style={{ marginTop: 0 }}>
                      {t`Attendee`} {index + 1} {t`Details`}
                    </h4>
                    <InputGroup>
                      <TextInput
                        withAsterisk
                        label={t`First Name`}
                        placeholder={t`First name`}
                        {...form.getInputProps(
                          `attendees.${attendeeIndex}.first_name`,
                        )}
                      />
                      <TextInput
                        withAsterisk
                        label={t`Last Name`}
                        placeholder={t`Last Name`}
                        {...form.getInputProps(
                          `attendees.${attendeeIndex}.last_name`,
                        )}
                      />
                    </InputGroup>

                    <TextInput
                      withAsterisk
                      label={t`Email Address`}
                      placeholder={t`Email Address`}
                      {...form.getInputProps(
                        `attendees.${attendeeIndex}.email`,
                      )}
                    />

                    {ticketQuestions && (
                      <CheckoutTicketQuestions
                        index={attendeeIndex}
                        ticket={ticket}
                        form={form}
                        questions={ticketQuestions}
                      />
                    )}
                  </Card>
                );

                attendeeIndex++;

                return attendeeInputs;
              })}
            </div>
          );
        })}
      </CheckoutContent>
    </form>
  );
};
