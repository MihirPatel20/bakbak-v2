import { BrowserView, MobileView } from "react-device-detect";
import withDualPaneLayout from "layout/DualPaneLayout";
import ChatInterface from "./ChatInterface";
import ChatList from "./ChatList";

const BrowserMessagePageView = withDualPaneLayout(ChatInterface, ChatList);

const DirectMessage = () => (
  <>
    <BrowserView>
      <BrowserMessagePageView />
    </BrowserView>
    <MobileView>
      <ChatInterface />
    </MobileView>
  </>
);
export default DirectMessage;
