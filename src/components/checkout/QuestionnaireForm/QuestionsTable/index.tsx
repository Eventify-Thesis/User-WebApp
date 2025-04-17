import { TextInput } from '@mantine/core';
import classes from './QuestionsTable.module.scss';
import { useForm } from '@mantine/form';
import { Card } from '../Card';
import { useTranslation } from 'react-i18next';
import { QuestionModel } from '@/domain/QuestionModel.ts';
import { QuestionInput } from '../CheckoutQuestion/index.tsx';
import { InputGroup } from '../InputGroup/index.tsx';

interface QuestionsTableProp {
  questions: Partial<QuestionModel>[];
}

const DefaultQuestions = () => {
  const { t } = useTranslation();
  return (
    <>
      <InputGroup>
        <TextInput
          withAsterisk
          label={t('First Name')}
          placeholder={t('First name')}
        />
        <TextInput
          withAsterisk
          label={t('Last Name')}
          placeholder={t('Last Name')}
        />
      </InputGroup>

      <TextInput
        withAsterisk
        type={'email'}
        label={t('Email Address')}
        placeholder={t('Email Address')}
      />
    </>
  );
};

export const QuestionsTable = ({ questions }: QuestionsTableProp) => {
  const { t } = useTranslation();
  const ticketQuestions = questions.filter(
    (question) => question.belongsTo === 'TICKET',
  );
  const orderQuestions = questions.filter(
    (question) => question.belongsTo === 'ORDER',
  );
  const form = useForm();
  // This disables the input fields in the preview
  form.getInputProps = (name: string) => ({
    id: name,
    value: form.values[name],
    onChange: () => {
      void 0;
    },
  });

  return (
    <div className={classes.outer}>
      <div className={classes.previewContainer}>
        <Card className={classes.previewCard}>
          <h3>{t('Order questions')}</h3>
          <div className={classes.previewForm}>
            <div className={classes.mask} />
            <DefaultQuestions />
            {orderQuestions.map((question) => (
              <QuestionInput
                key={question.id}
                question={question}
                name={String(question.id)}
                form={form}
              />
            ))}

            <h3>{t('Attendee questions')}</h3>
            <DefaultQuestions />
            {ticketQuestions.map((question) => (
              <QuestionInput
                key={question.id}
                question={question}
                name={String(question.id)}
                form={form}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
