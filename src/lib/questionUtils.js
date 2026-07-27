/**
 * Utility function to group questions sharing the same passageGroupId.
 * Keeps non-passage questions as single items while grouping passage-based questions together.
 * Preserves sub-question ordering within the group by passageOrder or creation timestamp.
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

      // Sort group questions by passageOrder (ascending), fallback to createdAt (ascending)
      groupQuestions.sort((a, b) => {
        const orderA = typeof a.passageOrder === "number" ? a.passageOrder : null;
        const orderB = typeof b.passageOrder === "number" ? b.passageOrder : null;

        if (orderA !== null && orderB !== null && orderA !== orderB) {
          return orderA - orderB;
        }

        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeA - timeB;
      });

      result.push({
        isGroup: true,
        passageGroupId: q.passageGroupId,
        passageStem: q.passageStem || groupQuestions[0]?.passageStem || "",
        questions: groupQuestions,
        meta: groupQuestions[0] || q,
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
