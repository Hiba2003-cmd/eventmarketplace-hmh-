export const AuthCard = ({ title, children, width = 'lg:w-4' }) => {
  return (
    <div className="flex align-items-center justify-content-center py-8 px-4">
      <div className={`surface-card p-4 shadow-2 border-round w-full ${width}`}>
        <div className="text-center mb-5">
          <div className="text-900 text-3xl font-medium mb-3">{title}</div>
        </div>
        {children}
      </div>
    </div>
  );
};