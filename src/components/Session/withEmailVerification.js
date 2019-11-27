import React, { useState } from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes('password');

const withEmailVerification = Component => {
  const WithEmailVerification = (props) => {
    const [isSent, setSent] = useState(false);

    const onSendEmailVerification = () => {
      props.firebase
        .doSendEmailVerification()
        .then(() => setSent(true));
    };

    return (
      <AuthUserContext.Consumer>
        {authUser =>
          needsEmailVerification(authUser) ? (
            <div>
              {isSent ? (
                <p>
                  E-Mail confirmation sent: Check your E-Mails (Spam
                  folder included) for a confirmation E-Mail.
                  Refresh this page once you confirmed your E-Mail.
                </p>
              ) : (
                <p>
                  Verify your E-Mail: Check your E-Mails (Spam folder
                  included) for a confirmation E-Mail or send
                  another confirmation E-Mail.
                </p>
              )}

              <button
                type="button"
                onClick={onSendEmailVerification}
                disabled={isSent}
              >
                Send confirmation E-Mail
              </button>
            </div>
          ) : (
            <Component {...props} />
          )
        }
      </AuthUserContext.Consumer>
    );
  }

  return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
