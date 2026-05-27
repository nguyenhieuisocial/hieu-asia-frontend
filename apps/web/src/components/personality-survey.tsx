'use client';

import * as React from 'react';
import { Model, surveyLocalization } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/survey-core.css';
// Wave 60.21 — Vietnamese locale so SurveyJS strings ("Answered 0/12
// questions", "Required", validators) render in vi instead of leaking
// English into a Vietnamese-only product.
import 'survey-core/i18n/vietnamese';
// Wave 60.21.b — overrides MOVED from `<style jsx global>` (which was being
// beaten by SurveyJS runtime CSS injection in production builds) to a real
// CSS file that wins the cascade.
import './personality-survey.css';
import { SURVEY_SCHEMA, type SurveyAnswers } from '@/lib/survey-schema';
import { EXTENDED_SURVEY_SCHEMA } from '@/lib/survey-schema-extended';

export type SurveyVariant = 'mbti' | 'extended';

export interface PersonalitySurveyProps {
  onComplete: (answers: SurveyAnswers) => void;
  /**
   * Wave 60.94.o — survey variant selection.
   * - 'mbti' (default, V1.0-V1.4 backward compat): 12 MBTI-axis questions
   * - 'extended' (Premium tier opt-in): 20 IPIP-NEO (Big Five) + 16 DiSC = 36 items
   * See: [[81 - V1 Postmortem]] §item 10 + lib/survey-schema-extended.ts.
   */
  variant?: SurveyVariant;
}

export function PersonalitySurvey({ onComplete, variant = 'mbti' }: PersonalitySurveyProps) {
  const model = React.useMemo(() => {
    // Wave 60.21 — set default locale before constructing the model so
    // built-in strings (progress, required, validator messages) localise.
    surveyLocalization.defaultLocale = 'vi';
    const schema = variant === 'extended' ? EXTENDED_SURVEY_SCHEMA : SURVEY_SCHEMA;
    const m = new Model(schema);
    m.locale = 'vi';
    // Brand-aligned overrides: SurveyJS default theme is too light for our dark UI.
    m.applyTheme({
      cssVariables: {
        '--sjs-general-backcolor': 'transparent',
        '--sjs-general-backcolor-dim': 'rgba(15, 15, 18, 0.6)',
        '--sjs-general-backcolor-dim-light': 'rgba(184, 146, 61, 0.05)',
        '--sjs-general-forecolor': '#F2EDE3',
        '--sjs-general-forecolor-light': 'rgba(242, 237, 227, 0.75)',
        '--sjs-primary-backcolor': '#B8923D',
        '--sjs-primary-backcolor-light': 'rgba(184, 146, 61, 0.15)',
        '--sjs-primary-forecolor': '#0F0F12',
        '--sjs-border-default': 'rgba(184, 146, 61, 0.25)',
        '--sjs-border-light': 'rgba(184, 146, 61, 0.15)',
        '--sjs-question-background': 'rgba(15, 15, 18, 0.5)',
        '--sjs-editor-background': 'rgba(15, 15, 18, 0.4)',
        '--sjs-corner-radius': '8px',
        '--sjs-font-family': 'var(--font-be-vietnam), system-ui, sans-serif',
      },
      themeName: 'hieu-dark',
      colorPalette: 'dark',
      isPanelless: true,
    });

    return m;
  }, [variant]);

  React.useEffect(() => {
    const handler = (sender: Model) => {
      onComplete(sender.data as SurveyAnswers);
    };
    model.onComplete.add(handler);
    return () => {
      model.onComplete.remove(handler);
    };
  }, [model, onComplete]);

  return (
    <div className="survey-host">
      <Survey model={model} />
    </div>
  );
}
