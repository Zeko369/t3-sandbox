import { type NextPage } from "next";
import { trpc } from "../utils/trpc";
import { ErrorBoundary } from "react-error-boundary";

const FindPost: React.FC<{ id: number }> = ({ id }) => {
  const { data, error, isLoading } = trpc.example.getPost.useQuery(id, {
    // useErrorBoundary: true,
    retry(failureCount, error) {
      return false;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{String(error)}</div>;
  }

  return (
    <div>
      <h1>{data.title}</h1>
    </div>
  );
};

const Wrapped: React.FC<{ id: number }> = ({ id }) => {
  return (
    <ErrorBoundary
      onError={(error) => {
        delete error.stack;
      }}
      FallbackComponent={({ resetErrorBoundary, error }) => (
        <div className="bg-red-400 p-3">
          <h1>{String(error)}</h1>
          <button onClick={resetErrorBoundary}>Reset</button>
        </div>
      )}
    >
      <FindPost id={id} />
    </ErrorBoundary>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Wrapped id={1} />
      <Wrapped id={2} />
    </>
  );
};

export default Home;
