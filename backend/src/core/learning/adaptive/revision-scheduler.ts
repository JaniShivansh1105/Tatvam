export class RevisionScheduler {
  /**
   * Calculates the next review date and interval using a modified SuperMemo-2 algorithm.
   */
  static scheduleNextReview(
    quality: number, // 0-5 (0 = complete blackout, 5 = perfect response)
    previousInterval: number, // In days
    previousEaseFactor: number
  ) {
    let easeFactor = previousEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    
    // Ensure easeFactor doesn't drop below a minimum threshold
    easeFactor = Math.max(1.3, easeFactor);

    let interval = 0;
    
    if (quality < 3) {
      // Failed, reset interval
      interval = 1;
    } else {
      if (previousInterval === 0) {
        interval = 1;
      } else if (previousInterval === 1) {
        interval = 6;
      } else {
        interval = Math.round(previousInterval * easeFactor);
      }
    }

    const nextReviewAt = new Date();
    nextReviewAt.setDate(nextReviewAt.getDate() + interval);

    return {
      nextReviewAt,
      interval,
      easeFactor
    };
  }
}
