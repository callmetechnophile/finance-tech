import { getRegistryCommands, Command } from "../registry";

export default function useCommandRegistry() {
  const commands = getRegistryCommands();

  const searchCommands = (query: string): Command[] => {
    if (!query.trim()) return commands;
    const lowercase = query.toLowerCase();
    return commands.filter((cmd) => cmd.label.toLowerCase().includes(lowercase));
  };

  return {
    commands,
    searchCommands,
  };
}
