'use client';

import * as React from 'react';
import { Model, surveyLocalization } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/survey-core.css';
// Wave 60.21 — Vietnamese locale so SurveyJS strings ("Answered 0/12
// questions", "Required", validators) render in vi instead of leaking
// English into a Vietnamese-only product.
import 'survey-core/i18n/vietnamese';
import { SURVEY_SCHEMA, type SurveyAnswers } from '@/lib/survey-schema';

export interface PersonalitySurveyProps {
  onComplete: (answers: SurveyAnswers) => void;
}

export function PersonalitySurvey({ onComplete }: PersonalitySurveyProps) {
  const model = React.useMemo(() => {
    // Wave 60.21 — set default locale before constructing the model so
    // built-in strings (progress, required, validator messages) localise.
    surveyLocalization.defaultLocale = 'vi';
    const m = new Model(SURVEY_SCHEMA);
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
      {/* Wave 60.21 — Scoped CSS overrides patching SurveyJS default-theme
          tokens that don't reach into nested selectors. Fixes 4 critical
          rendering bugs identified by Chrome MCP investigation:
            1. Primary action button used 5%-opacity gold bg → 1.00 contrast
               (text-on-self, invisible). Force solid gold bg + ink text.
            2. Radio decorator had 0px border → user can't see option circles.
            3. Rating widget items had transparent border → floating numbers.
            4. .sd-question__title wrapper had font-size:0px → required
               asterisk + spacing broken; restore to 1rem / leading-1.5. */}
      <style jsx global>{`
        .survey-host .sd-question__title,
        .survey-host .sv-title-actions {
          font-size: 1rem;
          line-height: 1.5;
        }
        .survey-host .sd-btn--action {
          background: #B8923D !important;
          color: #0F0F12 !important;
          border: 1px solid #B8923D !important;
          font-weight: 600;
        }
        .survey-host .sd-btn--action:hover {
          background: #C49E46 !important;
          border-color: #C49E46 !important;
        }
        .survey-host .sd-radio__decorator {
          border: 1.5px solid rgba(184, 146, 61, 0.5) !important;
          background: rgba(15, 15, 18, 0.6) !important;
        }
        .survey-host .sd-radio--checked .sd-radio__decorator {
          border-color: #B8923D !important;
        }
        .survey-host .sd-radio--checked .sd-radio__decorator::after {
          background: #B8923D !important;
        }
        .survey-host .sd-rating__item {
          border: 1.5px solid rgba(184, 146, 61, 0.3) !important;
          background: rgba(15, 15, 18, 0.6) !important;
        }
        .survey-host .sd-rating__item--selected {
          border-color: #B8923D !important;
          background: rgba(184, 146, 61, 0.2) !important;
        }
      `}</style>
      <Survey model={model} />
    </div>
  );
}
