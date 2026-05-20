'use client';

import * as React from 'react';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/survey-core.css';
import { SURVEY_SCHEMA, type SurveyAnswers } from '@/lib/survey-schema';

export interface PersonalitySurveyProps {
  onComplete: (answers: SurveyAnswers) => void;
}

export function PersonalitySurvey({ onComplete }: PersonalitySurveyProps) {
  const model = React.useMemo(() => {
    const m = new Model(SURVEY_SCHEMA);
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
  }, []);

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
