import * as React from "react";
import { useRecoilValue } from "recoil";

import { CURRENT_ACTION } from "../store";

const BotPage = () => {
  const action = useRecoilValue(CURRENT_ACTION);

  return (
    <div>
      <iframe />
      <div>{action}</div>
    </div>
  );
};

export default BotPage;
