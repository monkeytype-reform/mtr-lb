export function getLevelFromTotalXp(totalXp) {
  return Math.floor((Math.sqrt(392 * totalXp + 22801) - 53) / 98);
}