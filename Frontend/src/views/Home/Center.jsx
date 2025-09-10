import { PostDialogueBox } from './Components/PostDialogueBox';
import { ConnectionBussinessBox } from './Components/ConnectionBusiness';
import { UserPostBox } from './Components/UserPostBox';

export const CenterBar = () => {
    return <>
       {/* Dialogue Box for the posting */}
        <PostDialogueBox  />

        {/* Connection Business/project pane */}
        <ConnectionBussinessBox />

        {/* User Post */}
        <UserPostBox />
    </>
}