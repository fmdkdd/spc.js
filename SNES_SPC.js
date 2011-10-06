// SNES SPC-700 APU emulator

function SNES_SPC () {

	this.dsp;

	this.m;

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
SNES_SPC.prototype.sample_count = function() {
	return (this.m.extra_clocks >> 5) * 2;
}

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
SNES_SPC.prototype.read_port = function(t, port) {
	assert(port < port_count);
	return run_until_(t)[port];
}
SNES_SPC.prototype.write_port = function(t, port, data) {
	assert(port < port_count);
	// FIXME
	run_until_(t)[0x10 + port] = data;
}

// Runs SPC to end_time and starts a new time frame at 0
SNES_SPC.prototype.end_frame = function(end_time) {}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Sound control

// Mutes voices corresponding to non-zero bits in mask (issues repeated KOFF events).
// Reduces emulation accuracy.
SNES_SPC.prototype.voice_count = 8;
SNES_SPC.prototype.mute_voices = function(mask) {
	this.dsp.mute_voices(mask);
}

// If true, prevents channels and global volumes from being phase-negated.
// Only supported by fast DSP.
SNES_SPC.prototype.disable_surround = function(disable = true) {
	this.dsp.disable_surround(disable);
}

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
SNES_SPC.prototype.check_kon = function() {
	return this.dsp.check_kon();
}

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

SNES_SPC.prototype.rom_addr = 0xFFC0;

SNES_SPC.prototype.skipping_time = 127;

// Value that padding should be filled with
SNES_SPC.prototype.cpu_pad_fill = 0xFF;

SNES_SPC.prototype.r_test     = 0x0;
SNES_SPC.prototype.r_control  = 0x1;
SNES_SPC.prototype.r_dspaddr  = 0x2;
SNES_SPC.prototype.r_dspdata  = 0x3;
SNES_SPC.prototype.r_cpuio0   = 0x4;
SNES_SPC.prototype.r_cpuio1   = 0x5;
SNES_SPC.prototype.r_cpuio2   = 0x6;
SNES_SPC.prototype.r_cpuio3   = 0x7;
SNES_SPC.prototype.r_f8       = 0x8;
SNES_SPC.prototype.r_f9       = 0x9;
SNES_SPC.prototype.r_t0target = 0xA;
SNES_SPC.prototype.r_t1target = 0xB;
SNES_SPC.prototype.r_t2target = 0xC;
SNES_SPC.prototype.r_t0out    = 0xD;
SNES_SPC.prototype.r_t1out    = 0xE;
SNES_SPC.prototype.r_t2out    = 0xF;

SNES_SPC.prototype.timers_loaded = function() {}

SNES_SPC.prototype.enable_rom = function(enable) {}
SNES_SPC.prototype.reset_buf = function() {}
SNES_SPC.prototype.save_extra = function() {}
SNES_SPC.prototype.load_regs = function(in) {}
SNES_SPC.prototype.ram_loaded = function() {}
SNES_SPC.prototype.regs_loaded = function() {}
SNES_SPC.prototype.reset_time_regs = function() {}
SNES_SPC.prototype.reset_common = function(timer_counter_init) {}

SNES_SPC.prototype.run_timer_ = function(t, rel_time_t) {}
SNES_SPC.prototype.run_timer = function(t, rel_time_t) {}
SNES_SPC.prototype.dsp_read = function(rel_time_t) {}
SNES_SPC.prototype.dsp_write = function(data, rel_time_t) {}
SNES_SPC.prototype.cpu_write_smp_reg_ = function(data, rel_time_t, addr) {}
SNES_SPC.prototype.cpu_write_smp_reg = function(data, rel_time_t, addr) {}
SNES_SPC.prototype.cpu_write_high = function(data, i, rel_time_t) {}
SNES_SPC.prototype.cpu_write = function(data, addr, rel_time_t) {}
SNES_SPC.prototype.cpu_read_smp_reg = function(i, rel_time_t) {}
SNES_SPC.prototype.cpu_read = function(addr, rel_time_t) {}
SNES_SPC.prototype.CPU_mem_bit = function(pc, rel_time_t) {}

SNES_SPC.prototype.check_echo_access = function(addr) {}
SNES_SPC.prototype.run_until_ = function(end_time) {}

//SNES_SPC.prototype.signature [signature_size + 1];

SNES_SPC.prototype.save_regs = function(out) {}
