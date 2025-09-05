import { Container, Row, Col } from "react-bootstrap"
import { LeftSideCareerConnect } from './CareerConnect/Components/LeftSideCareerConnect'
import { MyRecentConnection } from './CareerConnect/Components/MyRecentConnection'
import { RecommendedConnectionCareerConnect } from './CareerConnect/Components/RecommendedConnection'
import { AdviceCornerCareerConnect } from './CareerConnect/Components/AdviceCorner'
import { LookingForJobOrCandidate } from './CareerConnect/Components/LookingForJobOrCandidate'
import { MoreConnectionCareerConnect } from './CareerConnect/Components/MoreConnection'
import { LeftSideButtonShortCut } from './Home/Components/LeftSideButtomShortCut'
import { LeftSideFooter } from './Home/Components/LeftSideFooter'
import { SearchPaneSkillConnect } from './SkillConnect/Components/SearchPane'
import { TrendingContent } from './SkillConnect/Components/TrendingContent'

export const CareerConnect = () => {
    return (
        <>
            <Container className="homeContainer">
                <Row>
                    {/* Left contnet area */}
                    <Col md={3} className="leftSideBar">
                        <LeftSideCareerConnect />
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
                        <MyRecentConnection />
                        <div className="mb-2"></div>
                        <RecommendedConnectionCareerConnect />
                        <div className="mb-2"></div>
                        <MoreConnectionCareerConnect />
                    </Col>

                    {/* Right content area */}
                    <Col md={3}>
                        <LookingForJobOrCandidate />
                        <div className="mb-2"></div>
                        <AdviceCornerCareerConnect />
                        <div className="mb-2"></div>
                        <TrendingContent />
                    </Col>
                </Row>
            </Container>
        </>
    )
}