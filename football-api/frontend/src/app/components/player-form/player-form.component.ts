import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PlayerService } from '../../services/player/player';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.css'],
})
export class PlayerFormComponent implements OnInit {
  playerForm: FormGroup;
  isEditMode = false;
  playerId?: number;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private playerService: PlayerService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.playerForm = this.fb.group({
      name: ['', Validators.required],
      club: ['', Validators.required],
      position: ['', Validators.required],
      nationality: ['', Validators.required],
      rating: [80, [Validators.required, Validators.min(1), Validators.max(99)]],
      speed: [75, [Validators.required, Validators.min(1), Validators.max(99)]],
      shooting: [75, [Validators.required, Validators.min(1), Validators.max(99)]],
      dribbling: [75, [Validators.required, Validators.min(1), Validators.max(99)]],
      passing: [75, [Validators.required, Validators.min(1), Validators.max(99)]],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.playerId = Number(id);
      this.playerService.getPlayer(this.playerId).subscribe({
        next: (player) => this.playerForm.patchValue(player),
        error: () => (this.errorMessage = 'No se pudo cargar el jugador'),
      });
    }
  }

  onSubmit() {
    if (this.playerForm.invalid) return;

    const data = this.playerForm.value;
    if (this.isEditMode && this.playerId) {
      this.playerService.updatePlayer(this.playerId, data).subscribe({
        next: (res) => this.router.navigate(['/players', res.id]),
        error: () => (this.errorMessage = 'Error al actualizar el jugador'),
      });
    } else {
      this.playerService.createPlayer(data).subscribe({
        next: (res) => this.router.navigate(['/players', res.id]),
        error: () => (this.errorMessage = 'Error al crear el jugador'),
      });
    }
  }
}
