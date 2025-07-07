import { ListService } from '../list';

describe('ListService', () => {
  let listService: ListService;

  beforeEach(() => {
    listService = new ListService();
  });

  describe('getGames', () => {
    it('should return available games', () => {
      const games = listService.getGames();
      expect(games).toHaveLength(2);
      expect(games[0].name).toBe('golf-4x');
      expect(games[1].name).toBe('dice-1000-10000');
    });
  });

  describe('getAgents', () => {
    it('should return available agents', () => {
      const agents = listService.getAgents();
      expect(agents).toHaveLength(3);
      expect(agents[0].name).toBe('random');
      expect(agents[1].name).toBe('low-card');
      expect(agents[2].name).toBe('example-agent');
    });
  });

  describe('getRuns', () => {
    it('should return available runs', () => {
      const runs = listService.getRuns();
      expect(runs).toHaveLength(1);
      expect(runs[0].game).toBe('golf-4x');
      expect(runs[0].scenario).toBe('scenario 1');
    });
  });

  describe('formatList', () => {
    it('should format the list output correctly', () => {
      const output = listService.formatList();
      
      expect(output).toContain('Available games:');
      expect(output).toContain(' ⎿ golf-4x');
      expect(output).toContain('    dice-1000-10000');
      
      expect(output).toContain('Available runs:');
      expect(output).toContain(' ⎿ golf-4x (scenario 1)');
      
      expect(output).toContain('Available agents:');
      expect(output).toContain(' ⎿ random');
      expect(output).toContain('    low-card');
      expect(output).toContain('    example-agent');
    });
  });
});