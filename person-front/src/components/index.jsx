export default function Index({ user }) {
  if (!user.IsActive) {
    return (
      <div className="container mt-5 jumbotron">
        <h1 className="display-4">Hi {user.username}</h1>
        <p className="lead">
          A confirmation email has been sent to {user.Email}. Click to link in
          the email to activate your account.
        </p>
        {/* <hr className="my-4" />
        <p>
          Didn't recieve th
        </p> */}
      </div>
    );
  } else {
    return (
      <div className="container mt-5 jumbotron">
        <h1 className="display-4">{user.username}'s homepage</h1>
        <p className="lead">
          This is a simple hero unit, a simple jumbotron-style component for
          calling extra attention to featured content or information.
        </p>
        <hr className="my-4" />
        <p>
          It uses utility classes for typography and spacing to space content
          out within the larger container.
        </p>
      </div>
    );
  }
}
