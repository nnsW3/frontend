import type { FC } from "react";
import {
  decodeGroupedAnalysis1,
  useGroupedAnalysis1,
} from "../api/grouped-analysis-1";
import { formatZeroDecimals } from "../../format";
import type { DateTimeString } from "../../time";
import { SECONDS_PER_SLOT } from "../../time";
import { LabelUnitText } from "../../components/Texts";
import LabelText from "../../components/TextsNext/LabelText";
import QuantifyText from "../../components/TextsNext/QuantifyText";
import SkeletonText from "../../components/TextsNext/SkeletonText";
import UltraSoundBarrier from "./UltraSoundBarrier";
import {
  WidgetBackground,
  WidgetTitle,
} from "../../components/WidgetSubcomponents";
import * as DateFns from "date-fns";
import { O, OAlt, pipe } from "../../fp";

type SpanningAgeProps = {
  isLoading: boolean;
  count: number | undefined;
  startedOn: DateTimeString | undefined;
};

const SpanningAge: FC<SpanningAgeProps> = ({ isLoading, count, startedOn }) => {
  const startedOnO = pipe(startedOn, O.fromNullable, O.map(DateFns.parseISO));
  const countO = O.fromNullable(count);
  const nowByCount = pipe(
    OAlt.sequenceTuple(startedOnO, countO),
    O.map(([startedOn, count]) =>
      DateFns.addSeconds(startedOn, count * SECONDS_PER_SLOT),
    ),
  );
  const formattedDistance = pipe(
    OAlt.sequenceTuple(startedOnO, nowByCount),
    O.map(([startedOn, nowByCount]) =>
      DateFns.formatDistanceStrict(startedOn, nowByCount, {
        roundingMethod: "floor",
      }),
    ),
  );
  const formattedNumber = pipe(
    formattedDistance,
    O.match(
      () => 0,
      (formattedDistance) => Number(formattedDistance.split(" ")[0]),
    ),
  );
  const formattedUnit = O.toUndefined(formattedDistance)?.split(" ")[1];

  return (
    <div className="flex gap-x-1 items-baseline">
      <QuantifyText size="text-4xl">
        <SkeletonText width="2rem">
          {isLoading ? undefined : formattedNumber}
        </SkeletonText>
      </QuantifyText>
      <QuantifyText color="text-slateus-200" className="ml-1" size="text-4xl">
        <SkeletonText width="8rem">
          {isLoading ? undefined : formattedUnit ?? "seconds"}
        </SkeletonText>
      </QuantifyText>
    </div>
  );
};

const GasStreakWidget: FC = () => {
  const groupedAnalysis1F = useGroupedAnalysis1();
  const groupedAnalysis1 = decodeGroupedAnalysis1(groupedAnalysis1F);
  const deflationaryStreak = groupedAnalysis1?.deflationaryStreak.postMerge;

  return (
    <WidgetBackground>
      <div className="flex flex-col gap-y-4">
        <div className="flex gap-x-2 items-center">
          <WidgetTitle>gas streak</WidgetTitle>
        </div>
        <SpanningAge
          isLoading={deflationaryStreak === undefined}
          startedOn={deflationaryStreak?.startedOn ?? undefined}
          count={deflationaryStreak?.count ?? undefined}
        />
        <div className="flex gap-x-1 items-center">
          <div className="flex gap-x-1 items-baseline">
            <LabelUnitText className="mt-1">
              <SkeletonText width="3rem">
                {deflationaryStreak === undefined
                  ? undefined
                  : deflationaryStreak === null
                  ? 0
                  : formatZeroDecimals(deflationaryStreak.count)}
              </SkeletonText>
            </LabelUnitText>
            <LabelText className="mt-1">
              {deflationaryStreak?.count === 1 ? " block" : " blocks"}
            </LabelText>
            <LabelText className="mt-1" color="text-slateus-400">
              above
            </LabelText>
          </div>
          <UltraSoundBarrier />
        </div>
      </div>
    </WidgetBackground>
  );
};

export default GasStreakWidget;
