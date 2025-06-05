const AuthWrapper = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="h-[100dvh] bg-gray-primary">
      <div className="max-w-screen-xl mx-auto h-full pb-8 px-8 flex flex-col">
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
};

export default AuthWrapper;
