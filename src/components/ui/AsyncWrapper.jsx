import { PageLoader } from "./skeletons/PageLoader";
import { ErrorFallback } from "../error/ErrorFallback";
import { EmptyState } from "./EmptyState";

export const AsyncWrapper = ({
  isLoading,
  isError,
  isEmpty,
  error,
  loadingFallback,
  emptyFallback,
  errorFallback,
  children,
  onRetry
}) => {
  if (isLoading) {
    return loadingFallback || <PageLoader />;
  }

  if (isError) {
    return errorFallback || <ErrorFallback error={error} resetErrorBoundary={onRetry} />;
  }

  if (isEmpty) {
    return emptyFallback || <EmptyState />;
  }

  return children;
};
