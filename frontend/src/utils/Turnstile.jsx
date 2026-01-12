import React from 'react';
import Turnstile from 'react-turnstile';

const TurnstileWidget = React.forwardRef(({
  onTokenObtained,
  appearance = 'interaction-only',
  onReset
}, ref) => (
  <Turnstile
    ref={ref}
    sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY}
    onVerify={onTokenObtained}
    onLoad={onReset}
    appearance={appearance}
    refreshExpired="auto"
    fixedSize
    theme="light"
  />
));

TurnstileWidget.displayName = 'TurnstileWidget';

export default TurnstileWidget;

