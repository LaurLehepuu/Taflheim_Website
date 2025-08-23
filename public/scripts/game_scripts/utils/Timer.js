export class Timer {
  constructor(callbacks = {}) {
    this.defender_time = 0;
    this.attacker_time = 0;
    this.active_side = null;
    this.is_running = false;
    this.lastUpdate = Date.now();
    this.interval = null;
    
    // Store callback functions
    this.onTimeout = callbacks.onTimeout || null;
    this.onWarning = callbacks.onWarning || null;
    this.onTick = callbacks.onTick || null;
    this.onSync = callbacks.onSync || null;
  }

  // Initialize timer with server data
  initialize(serverTimes) {
    this.defender_time = serverTimes.defender;
    this.attacker_time = serverTimes.attacker;
    this.active_side = serverTimes.active_side;
    console.log('Timer initialized:', this.getTimes());
  }

  // Sync with server times (called when receiving server updates)
  syncWithServer(serverTimes) {
    this.defender_time = serverTimes.defender;
    this.attacker_time = serverTimes.attacker;
    this.active_side = serverTimes.active_side;
    this.lastUpdate = Date.now();
    
    this.onSync?.(this.getTimes());
    console.log('Timer synced with server:', this.getTimes());
  }

  start() {
    if (this.is_running) return;
    
    this.is_running = true;
    this.lastUpdate = Date.now();
    
    this.interval = setInterval(() => {
      this.updateTime();
      this.checkWarnings();
      this.checkTimeout();
    }, 100); // Update every 100ms to match server
    
    console.log('Client timer started');
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.is_running = false;
    console.log('Client timer stopped');
  }

  updateTime() {
    const now = Date.now();
    const elapsed = now - this.lastUpdate;
    
    if (this.active_side === "attacker") {
      this.attacker_time = Math.max(0, this.attacker_time - elapsed);
    } else if (this.active_side === "defender") {
      this.defender_time = Math.max(0, this.defender_time - elapsed);
    }
    
    this.lastUpdate = now;
    
    // Call tick callback
    this.onTick?.(this.getTimes());
  }

  checkWarnings() {
    const currentTime = this.getCurrentTime();
    
    // Warning at 30 seconds
    if (currentTime <= 30000 && currentTime > 29000) {
      this.onWarning?.(this.active_side, currentTime, '30 seconds');
    }
    
    // Critical warning at 10 seconds
    if (currentTime <= 10000 && currentTime > 9000) {
      this.onWarning?.(this.active_side, currentTime, '10 seconds');
    }
  }

  checkTimeout() {
    if (this.defender_time <= 0 || this.attacker_time <= 0) {
      this.stop();
      const loser = this.defender_time <= 0 ? "defender" : "attacker";
      this.onTimeout?.(loser, this.getTimes());
    }
  }

  switchPlayer() {
    this.active_side = this.active_side === 'defender' ? 'attacker' : 'defender';
    this.lastUpdate = Date.now();
    console.log('Timer switched to:', this.active_side);
  }

  getCurrentTime() {
    if (this.active_side === "attacker") {
      return this.attacker_time;
    } else if (this.active_side === "defender") {
      return this.defender_time;
    }
    return 0;
  }

  getTimes() {
    return {
      defender: this.defender_time,
      attacker: this.attacker_time,
      active_side: this.active_side,
      is_running: this.is_running
    };
  }

  // Format time for display (mm:ss)
  formatTime(milliseconds) {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Get formatted display times
  getFormattedTimes() {
    return {
      defender: this.formatTime(this.defender_time),
      attacker: this.formatTime(this.attacker_time),
      active_side: this.active_side
    };
  }

  // Pause timer (useful for game pause functionality)
  pause() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.is_running = false;
    console.log('Timer paused');
  }

  // Resume timer
  resume() {
    if (!this.is_running) {
      this.start();
    }
  }
}
