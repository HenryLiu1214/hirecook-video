import wave, struct, math, random

SR = 44100
BPM = 126
BEAT = SR * 60 // BPM  # 21000 samples per beat
BAR = BEAT * 4
DUR = 210
TOTAL = SR * DUR
out = [0.0] * TOTAL

random.seed(42)

def place(buf, pos, sig, gain=1.0):
    for i, v in enumerate(sig):
        if 0 <= pos + i < len(buf):
            buf[pos + i] += v * gain

def kick():
    n = int(SR * 0.5)
    result = []
    phase = 0.0
    for i in range(n):
        t = i / SR
        freq = 90 * math.exp(-t * 22) + 45
        phase += 2 * math.pi * freq / SR
        body_amp = math.exp(-t * 9) * 0.9
        click = math.exp(-t * 400) * 0.25 * random.gauss(0, 1)
        result.append(body_amp * math.sin(phase) + click)
    return result

def snare():
    n = int(SR * 0.22)
    result = []
    for i in range(n):
        t = i / SR
        body = math.exp(-t * 40) * 0.4 * math.sin(2 * math.pi * 200 * t)
        noise = math.exp(-t * 20) * 0.65 * random.gauss(0, 1)
        result.append(body + noise)
    return result

def hihat(decay=200, vol=0.28):
    n = int(SR * 0.04)
    return [math.exp(-i / SR * decay) * vol * random.gauss(0, 1) for i in range(n)]

def open_hat():
    n = int(SR * 0.14)
    return [math.exp(-i / SR * 28) * 0.22 * random.gauss(0, 1) for i in range(n)]

def bass_note(freq, dur_beats):
    n = int(BEAT * dur_beats)
    result = []
    for i in range(n):
        t = i / SR
        env = min(1.0, t * 80) * math.exp(-max(0, t - 0.06) * 5)
        env = max(0, env)
        v = math.sin(2 * math.pi * freq * t) + 0.35 * math.sin(2 * math.pi * freq * 2 * t + 0.5)
        result.append(v * env * 0.55)
    return result

def pad(freq, dur_s, vol=0.15):
    n = int(SR * dur_s)
    result = []
    for i in range(n):
        t = i / SR
        att = min(1.0, t / 1.2)
        rel = max(0, 1.0 - max(0, t - (dur_s - 1.5)) / 1.5)
        env = att * rel
        lfo = 1 + 0.035 * math.sin(2 * math.pi * 0.35 * t)
        v = (math.sin(2 * math.pi * freq * t) +
             0.45 * math.sin(2 * math.pi * freq * 2 * t + 0.8) +
             0.2 * math.sin(2 * math.pi * freq * 3 * t + 1.5))
        result.append(v * env * lfo * vol)
    return result

KICK = kick()
SNARE = snare()
HIHAT = hihat()
OPEN_HAT = open_hat()

# -- Drums: 4/4 grid --
# Every beat, place hihat. Kick on 1+3, snare on 2+4
# Every 16 beats, add variation
beat_num = 0
pos = 0
while pos < TOTAL:
    bar_beat = beat_num % 4
    bar_num = beat_num // 4
    phrase = bar_num % 8

    # Kick on 1 and 3
    if bar_beat == 0:
        place(out, pos, KICK)
        if phrase in [3, 7]:  # extra kick pickup
            place(out, pos + BEAT * 3 // 4, KICK, 0.65)
    elif bar_beat == 2:
        place(out, pos, KICK)

    # Snare on 2 and 4
    if bar_beat == 1 or bar_beat == 3:
        place(out, pos, SNARE)

    # Hi-hat: every 8th note (half-beat)
    place(out, pos, HIHAT)
    hat_vol = 0.55 if (beat_num % 2 == 1) else 1.0
    place(out, pos + BEAT // 2, HIHAT, hat_vol)

    # Open hat on every 4th beat offbeat
    if bar_beat == 3 and phrase % 2 == 1:
        place(out, pos + BEAT // 2, OPEN_HAT)

    pos += BEAT
    beat_num += 1

# -- Bass: 8-note pattern over 2 bars (8 beats) --
BASS_NOTES = [
    (110, 1), (110, 1), (82.4, 0.5), (110, 0.5), (98, 1),
    (110, 1), (82.4, 1), (98, 0.5), (110, 0.5),
]
pos = 0
note_i = 0
while pos < TOTAL:
    freq, beats = BASS_NOTES[note_i % len(BASS_NOTES)]
    note = bass_note(freq, beats)
    place(out, pos, note)
    pos += int(BEAT * beats)
    note_i += 1

# -- Pads: A minor chord (A2=110, C3=130.8, E3=164.8), 8-bar cycles --
chord_dur = BAR * 4 / SR  # 4 bars in seconds
pos = 0
while pos < TOTAL:
    for freq in [110, 130.8, 164.8]:
        place(out, pos, pad(freq, chord_dur))
    pos += int(SR * chord_dur)

# -- Normalize --
peak = max(abs(x) for x in out)
scale = 0.88 / peak if peak > 0 else 1.0

out_path = '/Users/henry/Desktop/hirecook-video/public/music.wav'
with wave.open(out_path, 'w') as wf:
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(SR)
    for s in out:
        clamped = max(-1.0, min(1.0, s * scale))
        wf.writeframes(struct.pack('<h', int(clamped * 32767)))

print(f"Done — {DUR}s rhythmic beat at {BPM} BPM written to {out_path}")
