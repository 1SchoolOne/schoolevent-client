import { Helmet } from "react-helmet"
import { RouteObject } from "react-router-dom"

import { ChoosingRewardLayout } from "../../components/StudentSection/Reward/_components/ChoosingRewardLayout/ChoosingRewardLayout"

export const choosingRewardRoute: RouteObject = {
  path: '/reward/chooseReward',
  element: (
    <>
      <Helmet>
        <title>SchoolEvent | Cartes Cadeaux</title>
      </Helmet>
      <ChoosingRewardLayout/>
    </>
  ),
}