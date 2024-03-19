import { formatCompactNumber } from "@/utils/formatCompactNumber";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/16/solid";
import classNames from "classnames";

type Props = {
  score?: number;
  className?: string;
};
export const VoteActions = (props: Props) => {
  return (
    <div
      className={classNames(
        "text-xs flex-col w-8 items-center justify-center content-center",
        props.className,
      )}
    >
      <ArrowUpIcon className="h-5 w-8 hover:text-indigo-400 cursor-pointer" />
      {props.score && (
        <div className="text-center w-8 font-semibold">
          {formatCompactNumber.format(props.score)}
        </div>
      )}
      <ArrowDownIcon className="h-5 w-8 hover:text-rose-400 cursor-pointer" />
    </div>
  );
};
