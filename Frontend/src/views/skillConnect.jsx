import { Container, Row, Col } from "react-bootstrap"
import { MySkillSkillConnectPage } from './SkillConnect/Components/MySkill'
import { SearchPaneSkillConnect } from './SkillConnect/Components/SearchPane'
import { LeftSideButtonShortCut } from './Home/Components/LeftSideButtomShortCut'
import { LeftSideFooter } from './Home/Components/LeftSideFooter'
import { MyFavourites } from './SkillConnect/Components/MyFavourites'
import { UpgradeSkill } from './SkillConnect/Components/UpgradeSkill'
import { ConnectAsLearnerOrTutor } from './SkillConnect/Components/ConnectAsLearnerOrTutor'
import { TrendingContent } from './SkillConnect/Components/TrendingContent'
export const SkillConnect = () => {
    return (
        <>
            <Container className="homeContainer">
                <Row>
                    {/* Left contnet area */}
                    <Col md={3} className="leftSideBar">
                        <MySkillSkillConnectPage />
                        <div className="mb-2"></div>
                        <LeftSideButtonShortCut />
                        <div className="mb-2"></div>
                        <LeftSideFooter />
                    </Col>

                    {/* Main content area */}
                    <Col md={6}>
                        {/* Search Pane */}
                        <SearchPaneSkillConnect />
                        <div className="mb-2"></div>
                        <MyFavourites />
                        <div className="mb-2"></div>
                        <UpgradeSkill />
                    </Col>

                    {/* Right content area */}
                    <Col md={3}>
                        <ConnectAsLearnerOrTutor />
                        <div className="mb-2"></div>
                        <TrendingContent />

                    </Col>
                </Row>
            </Container>
        </>
    )

}

export default SkillConnect;