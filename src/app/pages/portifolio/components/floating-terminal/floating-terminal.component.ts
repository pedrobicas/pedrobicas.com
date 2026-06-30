import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface OutputLine {
  type: 'system' | 'command' | 'info' | 'error';
  content: string;
  timestamp: string;
}

@Component({
  selector: 'app-floating-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './floating-terminal.component.html',
  styleUrls: ['./floating-terminal.component.scss']
})
export class FloatingTerminalComponent {
  isTerminalOpen = false;
  currentCommand = '';
  outputLines: OutputLine[] = [];

  readonly quickCommands = ['help', 'whoami', 'skills', 'projects', 'contact'];

  openTerminal(): void {
    this.isTerminalOpen = true;
    if (!this.outputLines.length) {
      this.addOutput('system', 'Terminal do portfólio iniciado. Digite help para ver os comandos.');
    }
  }

  closeTerminal(): void {
    this.isTerminalOpen = false;
  }

  executeCommand(command = this.currentCommand): void {
    const normalized = command.trim().toLowerCase();
    if (!normalized) return;

    this.addOutput('command', `pedro@portfolio:~$ ${normalized}`);
    this.currentCommand = '';

    const handlers: Record<string, () => void> = {
      help: () => this.addOutput('info', 'Comandos: whoami, skills, projects, contact, clear.'),
      whoami: () => this.addOutput('info', 'Pedro Bicas - desenvolvimento web, APIs e produto.'),
      skills: () => this.addOutput('info', 'Angular, React, TypeScript, Java, Spring Boot, Python, PostgreSQL e Docker.'),
      projects: () => this.addOutput('info', 'Veja os projetos selecionados na seção Cases do portfólio.'),
      contact: () => this.addOutput('info', 'Contato: pedro.bicas14@gmail.com | linkedin.com/in/pedrobicas'),
      clear: () => { this.outputLines = []; }
    };

    const handler = handlers[normalized];
    if (handler) {
      handler();
      return;
    }

    this.addOutput('error', `Comando não encontrado: ${normalized}`);
  }

  executeQuickCommand(command: string): void {
    this.openTerminal();
    this.executeCommand(command);
  }

  private addOutput(type: OutputLine['type'], content: string): void {
    this.outputLines.push({
      type,
      content,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    });
  }
}
