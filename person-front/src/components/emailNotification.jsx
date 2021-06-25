import React from "react";

export default function EmailNotificaiton({ sendEmail, email, guid }) {
  function handleResend(email, guid) {
    sendEmail(email, guid);
  }
  return (
    <div className="container mt-5 jumbotron">
      <h1 className="display-4">Thank you!</h1>
      <p className="lead">
        A confirmation email has been sent to {email}. Click the link in the
        email activate your account.
      </p>
      {/* <hr className="my-4" />
      <p>Didn't recieve the email?</p>
      <button
        type="submit"
        className="btn btn-primary"
        onClick={handleResend()}
      >
        Resend verification email
      </button> */}
    </div>
  );
}
