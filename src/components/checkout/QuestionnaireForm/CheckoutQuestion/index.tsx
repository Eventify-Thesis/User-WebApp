import { QuestionType, Ticket } from '@/types/types.ts';
import { useTranslation } from 'react-i18next';
import { UseFormReturnType } from '@mantine/form';
import {
  Box,
  Checkbox,
  ComboboxItem,
  Group,
  NativeSelect,
  Radio,
  Select,
  Textarea,
  TextInput,
} from '@mantine/core';
import countries from '@/data/countries.json';
import { InputGroup } from '../InputGroup';
import classes from './CheckoutQuestion.module.scss';
import { QuestionModel } from '@/domain/QuestionModel';
import { UserGeneratedContent } from '../UserGeneratedContent';
import { TicketTypeModel } from '@/domain/TicketTypeModel';

interface CheckoutQuestionProps {
  questions: QuestionModel[];
  form: UseFormReturnType<any, any>;
}

interface QuestionInputProps {
  question: Partial<QuestionModel>;
  name: string;
  form: UseFormReturnType<any, any>;
}

interface CheckoutTicketQuestionProps {
  questions: QuestionModel[];
  form: UseFormReturnType<any, any>;
  ticket: TicketTypeModel;
  index: number;
}

const DropDownInput = ({ question, name, form }: QuestionInputProps) => {
  const items: ComboboxItem[] = [];

  question.options?.map((option) => {
    items.push({
      value: option,
      label: option,
    });
  });
  return (
    <Select
      styles={{
        label: { color: '#000000' },
        description: { color: '#000000' },
      }}
      classNames={{
        description: classes.descriptionWithNoStyle,
      }}
      description={
        <UserGeneratedContent
          dangerouslySetInnerHTML={{ __html: question.description || '' }}
        />
      }
      {...form.getInputProps(`${name}.answer`)}
      data={items}
      label={question.title}
      withAsterisk={question.required}
    />
  );
};

const MultiLineTextInput = ({ question, name, form }: QuestionInputProps) => {
  return (
    <>
      <Textarea
        styles={{
          label: { color: '#000000' },
          description: { color: '#000000' },
        }}
        classNames={{
          description: classes.descriptionWithNoStyle,
        }}
        description={
          <UserGeneratedContent
            dangerouslySetInnerHTML={{ __html: question.description || '' }}
          />
        }
        {...form.getInputProps(`${name}.answer`)}
        withAsterisk={question.required}
        label={question.title}
      />
    </>
  );
};

const DateInput = ({ question, name, form }: QuestionInputProps) => {
  return (
    <>
      <TextInput
        withAsterisk={question.required}
        type="date"
        {...form.getInputProps(`${name}.answer`)}
        label={question.title}
        styles={{ label: { color: '#000000' } }}
      />
    </>
  );
};

const SingleLineTextInput = ({ question, name, form }: QuestionInputProps) => {
  return (
    <>
      <TextInput
        styles={{
          label: { color: '#000000' },
          description: { color: '#000000' },
        }}
        classNames={{
          description: classes.descriptionWithNoStyle,
        }}
        {...form.getInputProps(`${name}.answer`)}
        withAsterisk={question.required}
        label={question.title}
        description={
          <UserGeneratedContent
            dangerouslySetInnerHTML={{ __html: question.description || '' }}
          />
        }
      />
    </>
  );
};

const RadioInput = ({ question, name, form }: QuestionInputProps) => {
  return (
    <Radio.Group
      styles={{
        label: { color: '#000000' },
        description: { color: '#000000' },
      }}
      classNames={{
        description: classes.descriptionWithNoStyle,
      }}
      withAsterisk={question.required}
      {...form.getInputProps(`${name}.answer`)}
      label={question.title}
      description={
        <UserGeneratedContent
          dangerouslySetInnerHTML={{ __html: question.description || '' }}
        />
      }
    >
      <Group mt="xs">
        {question.options?.map((option, index) => {
          return (
            <Radio
              key={`${question.id}-radio-${index}`}
              label={option}
              value={option}
            />
          );
        })}
      </Group>
    </Radio.Group>
  );
};

const CheckBoxInput = ({ question, name, form }: QuestionInputProps) => {
  return (
    <Checkbox.Group
      styles={{
        label: { color: '#000000' },
        description: { color: '#000000' },
      }}
      classNames={{
        description: classes.descriptionWithNoStyle,
      }}
      withAsterisk={question.required}
      {...form.getInputProps(`${name}.answer`)}
      label={question.title}
      description={
        <UserGeneratedContent
          dangerouslySetInnerHTML={{ __html: question.description || '' }}
        />
      }
    >
      <Group mt="xs">
        {question.options?.map((option, index) => {
          return (
            <Checkbox
              key={`${question.id}-checkbox-${index}`}
              label={option}
              value={option}
            />
          );
        })}
      </Group>
    </Checkbox.Group>
  );
};

const AddressInput = ({ question, name, form }: QuestionInputProps) => {
  const { t } = useTranslation();
  // Define styles for text to ensure visibility on white background
  const textStyles = {
    color: '#000000',
  };

  return (
    <>
      <h4 style={textStyles}>{question.title}</h4>
      <div
        className={classes.description}
        style={textStyles}
        dangerouslySetInnerHTML={{ __html: question.description || '' }}
      />

      <TextInput
        withAsterisk={question.required}
        {...form.getInputProps(`${name}.address_line_1`)}
        label={t('questions.address.line1')}
        styles={{ label: { color: '#000000' } }}
      />
      <TextInput
        mt={20}
        {...form.getInputProps(`${name}.address_line_2`)}
        label={t('questions.address.line2')}
        styles={{ label: { color: '#000000' } }}
      />
      <InputGroup>
        <TextInput
          withAsterisk={question.required}
          {...form.getInputProps(`${name}.city`)}
          label={t('questions.address.city')}
          styles={{ label: { color: '#000000' } }}
        />
        <TextInput
          withAsterisk={question.required}
          {...form.getInputProps(`${name}.postal_code`)}
          label={t('questions.address.postal_code')}
          styles={{ label: { color: '#000000' } }}
        />
      </InputGroup>
      <NativeSelect
        withAsterisk={question.required}
        mt={20}
        {...form.getInputProps(`${name}.country`)}
        label={t('questions.address.country')}
        data={countries}
        styles={{ label: { color: '#000000' } }}
      />
    </>
  );
};

export const QuestionInput = ({ question, name, form }: QuestionInputProps) => {
  // All form elements have text color applied directly
  let input;
  switch (question.type) {
    case QuestionType.ADDRESS:
      input = <AddressInput question={question} name={name} form={form} />;
      break;
    case QuestionType.CHECKBOX:
      input = <CheckBoxInput question={question} name={name} form={form} />;
      break;
    case QuestionType.MULTI_LINE_TEXT:
      input = (
        <MultiLineTextInput question={question} name={name} form={form} />
      );
      break;
    case QuestionType.RADIO:
      input = <RadioInput question={question} name={name} form={form} />;
      break;
    case QuestionType.DROPDOWN:
      input = <DropDownInput question={question} name={name} form={form} />;
      break;
    case QuestionType.SINGLE_LINE_TEXT:
      input = (
        <SingleLineTextInput question={question} name={name} form={form} />
      );
      break;
    case QuestionType.DATE:
      input = <DateInput question={question} name={name} form={form} />;
      break;
  }

  return (
    <Box mt={20} style={{ color: '#000000' }}>
      {input}
    </Box>
  );
};

export const CheckoutOrderQuestions = ({
  questions,
  form,
}: CheckoutQuestionProps) => {
  let questionIndex = 0;
  return (
    <>
      {questions.map((question, index) => {
        const name = `order.questions.${questionIndex++}.response`;
        return (
          <QuestionInput
            key={`${index}-question`}
            question={question}
            name={name}
            form={form}
          />
        );
      })}
    </>
  );
};

export const CheckoutTicketQuestions = ({
  questions,
  form,
  ticket,
  index: attendeeIndex,
}: CheckoutTicketQuestionProps) => {
  let questionIndex = 0;
  return (
    <>
      {questions.map((question, index) => {
        if (!question.ticketTypeIds?.includes(ticket.id)) {
          return;
        }

        const name = `attendees.${attendeeIndex}.questions.${questionIndex++}.response`;
        return (
          <QuestionInput
            key={`${index}-attendee`}
            question={question}
            name={name}
            form={form}
          />
        );
      })}
    </>
  );
};
