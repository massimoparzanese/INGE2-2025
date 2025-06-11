class ReservaUtils {
  static includesDate(from, to, d) {
    const date = new Date(d);
    const start = new Date(from);
    const end = new Date(to);
    return date >= start && date <= end;
  }

  static overlaps(f1, t1, f2, t2) {
    const start1 = new Date(f1);
    const end1 = new Date(t1);
    const start2 = new Date(f2);
    const end2 = new Date(t2);

    // Versión simple y correcta
    return start1 <= end2 && start2 <= end1;
  }
}

export default ReservaUtils;