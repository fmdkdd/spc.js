// SNES SPC-700 APU emulator

function SNES_SPC () {

	this.dsp;

}

// Sample pairs generated per second
SNES_SPC.prototype.sample_rate = 32000;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Emulator use

// Sets IPL ROM data. Library does not include ROM data. Most SPC music files
// don't need ROM, but a full emulator must provide this.
SNES_SPC.prototype.rom_size = 0x40;
SNES_SPC.prototype.init_rom = function(rom) {}

// Sets destination for output samples
SNES_SPC.prototype.set_output = function(out, out_size) {}

// Number of samples written to output since last set
SNES_SPC.prototype.sample_count = function() {}

// Resets SPC to power-on state. This resets your output buffer, so you must
// call set_output() after this.
SNES_SPC.prototype.reset = function() {}

// Emulates pressing reset switch on SNES. This resets your output buffer, so
// you must call set_output() after this.
SNES_SPC.prototype.soft_reset = function() {}

// 1024000 SPC clocks per second, sample pair every 32 clocks
SNES_SPC.prototype.clock_rate = 1024000;
SNES_SPC.prototype.clocks_per_sample = 32;

// Emulated port read/write at specified time
SNES_SPC.prototype.port_count = 4;
SNES_SPC.prototype.read_port = function(time_t, port) {}
SNES_SPC.prototype.write_port = function(time_t, port, data) {}

// Runs SPC to end_time and starts a new time frame at 0
SNES_SPC.prototype.end_frame = function(end_time) {}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Sound control

// Mutes voices corresponding to non-zero bits in mask (issues repeated KOFF events).
// Reduces emulation accuracy.
SNES_SPC.prototype.voice_count = 8;
SNES_SPC.prototype.mute_voices = function(mask) {}

// If true, prevents channels and global volumes from being phase-negated.
// Only supported by fast DSP.
SNES_SPC.prototype.disable_surround = function(disable = true) {}

// Sets tempo, where tempo_unit = normal, tempo_unit / 2 = half speed, etc.
SNES_SPC.prototype.tempo_unit = 0x100;
SNES_SPC.prototype.set_tempo = function(tempo);


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// SPC music files

// Loads SPC data into emulator
SNES_SPC.prototype.spc_min_file_size = 0x10180;
SNES_SPC.prototype.spc_file_size     = 0x10200;
SNES_SPC.prototype.load_spc = function(in, size) {}

// Clears echo region. Useful after loading an SPC as many have garbage in echo.
SNES_SPC.prototype.clear_echo = function() {}

// Plays for count samples and write samples to out. Discards samples if out
// is NULL. Count must be a multiple of 2 since output is stereo.
SNES_SPC.prototype.play = function(count, out) {}

// Skips count samples. Several times faster than play() when using fast DSP.
SNES_SPC.prototype.skip = function(count) {}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// State save/load (only available with accurate DSP)

// Saves/loads state
SNES_SPC.prototype.state_size = 67 * 1024L; // maximum space needed when saving
SNES_SPC.prototype.copy_state = function(io, copy_func_t) {}

// Writes minimal header to spc_out
SNES_SPC.prototype.init_header = function(spc_out) {}

// Saves emulator state as SPC file data. Writes spc_file_size bytes to spc_out.
// Does not set up SPC header; use init_header() for that.
SNES_SPC.prototype.save_spc = function(spc_out) {}

// Returns true if new key-on events occurred since last check. Useful for
// trimming silence while saving an SPC.
SNES_SPC.prototype.check_kon = function() {}



// Time relative to m_spc_time. Speeds up code a bit by eliminating need to
// constantly add m_spc_time to time from CPU. CPU uses time that ends at
// 0 to eliminate reloading end time every instruction. It pays off.
SNES_SPC.prototype.Timer = function() {
	this.next_time; // time of next event
	this.prescaler;
	this.period;
	this.divider;
	this.enabled;
	this.counter;
}

SNES_SPC.prototype.reg_count = 0x10;
SNES_SPC.prototype.timer_count = 3;
SNES_SPC.prototype.extra_size = SPC_DSP.extra_size;

SNES_SPC.prototype.signature_size = 35;
