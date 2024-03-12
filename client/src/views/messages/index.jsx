import { BrowserView, MobileView } from "react-device-detect";
import withDualPaneLayout from "layout/DualPaneLayout";
import ChatList from "./ChatList";
import ChatInterface from "./ChatInterface";

const BrowserMessagePageView = withDualPaneLayout(ChatInterface, ChatList);

const MessagesPage = () => (
  <>
    <BrowserView>
      <BrowserMessagePageView />
    </BrowserView>
    <MobileView>
      <ChatList />
    </MobileView>
  </>
);
export default MessagesPage;
