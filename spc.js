var fs = require('fs');

function readSPC(fd) {
	// See spc_file_format.txt

	function read(fd, offset, size) {
		buff = new Buffer(size);
		fs.readSync(fd, buff, 0, size, offset);

		return buff;
	}

	function ascii(fd, offset, size) {
		return read(fd, offset, size).toString('ascii');
	}

	function number(fd, offset, size) {
		var buff = read(fd, offset, size);

		var num = 0;
		for (var i=0; i < size-1; ++i) {
			num |= buff[i];
			num = num << 8;
		}
		num |= buff[size-1];

		return num;
	}

	var SPC = {};

	// Header

	SPC.fileHeader = ascii(fd, 0x00000, 33);
	SPC.ID666Flag = number(fd, 0x00023, 1) === 26;
	SPC.versionMinor = number(fd, 0x00024, 1);

	// SPC700 Registers

	SPC.registers = {}

	SPC.registers.PC = number(fd, 0x00025, 2);
	SPC.registers.A = number(fd, 0x00027, 1);
	SPC.registers.X = number(fd, 0x00028, 1);
	SPC.registers.Y = number(fd, 0x00029, 1);
	SPC.registers.PSW	= number(fd, 0x0002A, 1);
	SPC.registers.SP = number(fd, 0x0002B, 1);

	// ID666 Tag (text format)

	SPC.ID666 = { text: {}, binary: {} }

	SPC.ID666.text.songTitle = ascii(fd, 0x0002E,32);
	SPC.ID666.text.gameTitle = ascii(fd, 0x0004E, 32);
	SPC.ID666.text.dumper = ascii(fd, 0x0006E, 16);
	SPC.ID666.text.comments = ascii(fd, 0x0007E, 32);
	SPC.ID666.text.dumpDate = ascii(fd, 0x0009E, 11);
	SPC.ID666.text.songDuration = ascii(fd, 0x000A9, 3);
	SPC.ID666.text.fadeLength = ascii(fd, 0x000AC, 5);
	SPC.ID666.text.songArtist = ascii(fd, 0x000B1, 32);
	SPC.ID666.text.defaultChannelDisable = number(fd, 0x000D0, 1) === 1;
	SPC.ID666.text.dumpEmulator = number(fd, 0x000D1, 1);

	// ID666 Tag (binary format)

	SPC.ID666.binary.songTitle = ascii(fd, 0x0002E, 32);
	SPC.ID666.binary.gameTitle = ascii(fd, 0x0004E, 32);
	SPC.ID666.binary.dumper = ascii(fd, 0x0006E, 16);
	SPC.ID666.binary.comments = ascii(fd, 0x0007E, 32);
	SPC.ID666.binary.dumpDate = ascii(fd, 0x0009E, 11);
	SPC.ID666.binary.songDuration = ascii(fd, 0x000A9, 3);
	SPC.ID666.binary.fadeLength = ascii(fd, 0x000AC, 5);
	SPC.ID666.binary.songArtist = ascii(fd, 0x000B1, 32);
	SPC.ID666.binary.defaultChannelDisable = number(fd, 0x000D0, 1) === 1;
	SPC.ID666.binary.dumpEmulator = number(fd, 0x000D1, 1);

	// Main course

	SPC.RAM = read(fd, 0x00100, 65536);
	SPC.DSPRegisters = read(fd, 0x10100, 128);

	return SPC;
}

function main() {
	var file = fs.openSync('test.spc', 'r');

	console.info(readSPC(file));

	fs.closeSync(file);
}

main();