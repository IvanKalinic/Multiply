import { NotificationContainer } from "../../styles";

interface Props {
  showNotification: boolean;
}

const Notification = () => {
  return (
    <NotificationContainer>
      <p>You have already entered this letter</p>
    </NotificationContainer>
  );
};

export default Notification;
