import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Player, Match, Court } from "@/lib/types";
import { mockPlayers, mockMatches, mockCourts } from "@/lib/mockData";

interface TournamentContextType {
  players: Player[];
  matches: Match[];
  courts: Court[];
  addPlayer: (player: Player) => void;
  updatePlayer: (id: string, player: Partial<Player>) => void;
  deletePlayer: (id: string) => void;
  generateFixtures: (format: string, category: string) => Match[];
  updateMatch: (id: string, match: Partial<Match>) => void;
  assignCourtToMatch: (matchId: string, courtId: number, startTime: string, endTime: string) => void;
  allocateCourtsToSession: (courtCount: number) => void;
  availableCourts: number;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [availableCourts, setAvailableCourts] = useState(4);

  useEffect(() => {
    // Initialize with mock data
    setPlayers(mockPlayers);
    setMatches(mockMatches);
    setCourts(mockCourts);
  }, []);

  const addPlayer = (player: Player) => {
    setPlayers([...players, player]);
  };

  const updatePlayer = (id: string, updatedPlayer: Partial<Player>) => {
    setPlayers(players.map(p => p.id === id ? { ...p, ...updatedPlayer } : p));
  };

  const deletePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const generateFixtures = (format: string, category: string): Match[] => {
    const categoryPlayers = players.filter(p => 
      p.events.some(e => e.toLowerCase().includes(category.toLowerCase()))
    );

    const newMatches: Match[] = [];
    
    if (format === "knockout") {
      for (let i = 0; i < categoryPlayers.length; i += 2) {
        if (i + 1 < categoryPlayers.length) {
          newMatches.push({
            id: `match_${Date.now()}_${i}`,
            code: `M${newMatches.length + 1}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            player1: categoryPlayers[i].name,
            player2: categoryPlayers[i + 1].name,
            eventType: category,
            category: "Round 1",
            round: "R1",
            status: "pending",
          });
        }
      }
    } else {
      // Round robin - everyone plays everyone
      for (let i = 0; i < categoryPlayers.length; i++) {
        for (let j = i + 1; j < categoryPlayers.length; j++) {
          newMatches.push({
            id: `match_${Date.now()}_${i}_${j}`,
            code: `M${newMatches.length + 1}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            player1: categoryPlayers[i].name,
            player2: categoryPlayers[j].name,
            eventType: category,
            category: "Round Robin",
            round: "RR",
            status: "pending",
          });
        }
      }
    }

    setMatches([...matches, ...newMatches]);
    return newMatches;
  };

  const updateMatch = (id: string, updatedMatch: Partial<Match>) => {
    setMatches(matches.map(m => m.id === id ? { ...m, ...updatedMatch } : m));
  };

  const assignCourtToMatch = (matchId: string, courtId: number, startTime: string, endTime: string) => {
    setMatches(matches.map(m => 
      m.id === matchId 
        ? { ...m, court: courtId, startTime, endTime, status: "ongoing" as const }
        : m
    ));

    const match = matches.find(m => m.id === matchId);
    if (match) {
      setCourts(courts.map(c => 
        c.id === courtId 
          ? { ...c, currentMatch: { ...match, court: courtId, startTime, endTime } }
          : c
      ));
    }
  };

  const allocateCourtsToSession = (courtCount: number) => {
    setAvailableCourts(courtCount);
    const newCourts: Court[] = [];
    for (let i = 1; i <= courtCount; i++) {
      newCourts.push({ id: i });
    }
    setCourts(newCourts);
  };

  return (
    <TournamentContext.Provider
      value={{
        players,
        matches,
        courts,
        addPlayer,
        updatePlayer,
        deletePlayer,
        generateFixtures,
        updateMatch,
        assignCourtToMatch,
        allocateCourtsToSession,
        availableCourts,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error("useTournament must be used within a TournamentProvider");
  }
  return context;
}
