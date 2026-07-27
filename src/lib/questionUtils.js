/**
 * Utility function to group questions sharing the same passageGroupId.
 * Keeps non-passage questions as single items while grouping passage-based questions together.
 */
export function groupPassageQuestions(questionsList) {
  if (!Array.isArray(questionsList)) return [];

  const result = [];
  const processedGroupIds = new Set();

  questionsList.forEach((q) => {
    if (q.passageGroupId) {
      if (processedGroupIds.has(q.passageGroupId)) return;
      processedGroupIds.add(q.passageGroupId);

      const groupQuestions = questionsList.filter(
        (item) => item.passageGroupId === q.passageGroupId
      );

      result.push({
        isGroup: true,
        passageGroupId: q.passageGroupId,
        passageStem: q.passageStem || groupQuestions[0]?.passageStem || "",
        questions: groupQuestions,
        meta: q,
      });
    } else {
      result.push({
        isGroup: false,
        question: q,
      });
    }
  });

  return result;
}
