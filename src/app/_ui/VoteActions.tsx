import { formatCompactNumber } from "@/utils/formatCompactNumber";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/16/solid";

type Props = {
  score?: number;
};
export const VoteActions = (props: Props) => {
  return (
    <div className="text-xs flex-col w-10 items-center justify-center content-center">
      <ArrowUpIcon className="h-5 w-10 hover:text-indigo-400 cursor-pointer" />
      {props.score && (
        <div className="text-center w-10 font-semibold">
          {formatCompactNumber.format(props.score)}
        </div>
      )}
      <ArrowDownIcon className="h-5 w-10 hover:text-rose-400 cursor-pointer" />
    </div>
  );
};
