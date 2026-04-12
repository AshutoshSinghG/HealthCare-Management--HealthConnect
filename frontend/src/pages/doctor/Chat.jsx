import LiveChat from '../../components/chat/LiveChat';

const DoctorChat = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Live Patient Chat</h1>
          <p className="text-surface-500 mt-1">Chat securely with your patients during their booked appointment time</p>
        </div>
      </div>
      <LiveChat />
    </div>
  );
};

export default DoctorChat;
