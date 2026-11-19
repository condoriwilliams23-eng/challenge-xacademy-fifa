// src/app/components/player/player.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { PlayerService, Player } from '../../services/player/player';

Chart.register(...registerables);

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [PlayerService],
  templateUrl: './player.html',
  styleUrls: ['./player.css'],
})
export class PlayerComponent implements OnInit {
  player?: Player;
  errorMessage = '';
  chart?: Chart;

  constructor(
    private playerService: PlayerService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    console.log('PlayerComponent initialized');
    const id = Number(this.route.snapshot.paramMap.get('id')) || 20;
    this.playerService.getPlayer(id).subscribe({
      next: (data) => {
        this.player = data;
        setTimeout(() => this.createChart(), 0);
      },
      error: (err) => (this.errorMessage = 'Jugador no encontrado'),
    });
  }

  createChart() {
    if (!this.player) return;
    const canvas = document.getElementById('skillsChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: 'radar',
      data: {
        labels: ['Rating', 'Velocidad', 'Tiro', 'Regate', 'Pase'],
        datasets: [
          {
            label: this.player.name,
            data: [
              this.player.rating,
              this.player.speed,
              this.player.shooting,
              this.player.dribbling,
              this.player.passing,
            ],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
          },
        ],
      },
      options: {
        scales: {
          r: {
            min: 0,
            max: 100,
          },
        },
      },
    });
  }
}
