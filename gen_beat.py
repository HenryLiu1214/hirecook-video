import wave, struct, math
import numpy as np

SR = 44100
BPM = 122
DUR = 184
N = SR * DUR
BEAT = int(SR * 60 / BPM)
out = np.zeros(N, dtype=np.float32)
rng = np.random.default_rng(7)

def add(pos, sig, gain=1.0):
    pos = int(pos)
    if pos >= N:
        return
    n = min(len(sig), N - pos)
    if n > 0:
        out[pos:pos+n] += sig[:n] * gain

def kick():
    n = int(SR * 0.34)
    t = np.arange(n) / SR
    freq = 74 * np.exp(-t * 20) + 42
    phase = np.cumsum(2 * np.pi * freq / SR)
    click = np.exp(-t * 250) * 0.045 * rng.normal(size=n)
    return (np.sin(phase) * np.exp(-t * 8.5) * 0.82 + click).astype(np.float32)

def clap():
    n = int(SR * 0.16)
    t = np.arange(n) / SR
    return (rng.normal(size=n) * np.exp(-t * 24) * 0.22 + np.sin(2*np.pi*185*t) * np.exp(-t*35) * 0.12).astype(np.float32)

def tick(vol=0.08):
    n = int(SR * 0.025)
    t = np.arange(n) / SR
    return (rng.normal(size=n) * np.exp(-t * 180) * vol).astype(np.float32)

def pluck(freq, dur_beats=0.18, vol=0.10):
    n = max(32, int(BEAT * dur_beats))
    t = np.arange(n) / SR
    env = np.minimum(1, t * 90) * np.exp(-t * 7)
    wave = np.sin(2*np.pi*freq*t) + 0.35*np.sin(2*np.pi*freq*2*t + 0.2)
    return (wave * env * vol).astype(np.float32)

def bass(freq, beats=1, vol=0.25):
    n = int(BEAT * beats)
    t = np.arange(n) / SR
    env = np.minimum(1, t * 55) * np.exp(-np.maximum(0, t - 0.08) * 4.2)
    wave = np.sin(2*np.pi*freq*t) + 0.22*np.sin(2*np.pi*freq*2*t)
    return (wave * env * vol).astype(np.float32)

def pad(freq, dur_s, vol=0.07):
    n = int(SR * dur_s)
    t = np.arange(n) / SR
    attack = np.minimum(1, t / 1.8)
    release = np.maximum(0, 1 - np.maximum(0, t - (dur_s - 2.0)) / 2.0)
    lfo = 1 + 0.025*np.sin(2*np.pi*0.22*t)
    wave = np.sin(2*np.pi*freq*t) + 0.38*np.sin(2*np.pi*freq*2*t + 0.7)
    return (wave * attack * release * lfo * vol).astype(np.float32)

K, C, T = kick(), clap(), tick()
for beat in range(N // BEAT + 1):
    pos = beat * BEAT
    sec = pos / SR
    bar = beat % 4
    mid = sec >= 34
    full = 70 <= sec < 166
    pain = sec >= 4
    if pain and bar in (0, 2):
        add(pos, K, 0.78 if mid else 0.48)
    if full and bar in (1, 3):
        add(pos, C, 0.55)
    elif mid and bar == 3:
        add(pos, C, 0.32)
    if mid:
        for div in range(4):
            g = 0.36 if div == 0 else 0.20
            if sec > 166: g *= 0.45
            add(pos + div * BEAT // 4, T, g)

bass_pattern = [(55,1),(55,1),(82.4,1),(73.4,1),(65.4,1),(65.4,1),(82.4,1),(98,1)]
pos = 0
idx = 0
while pos < N:
    sec = pos / SR
    if 4 <= sec < 176:
        f,b = bass_pattern[idx % len(bass_pattern)]
        add(pos, bass(f,b), 0.55 if 70 <= sec < 166 else 0.36)
    pos += BEAT
    idx += 1

pulse_notes = [220, 246.9, 261.6, 329.6]
step_len = BEAT // 4
for step in range(N // step_len):
    pos = step * step_len
    sec = pos / SR
    if 34 <= sec < 166:
        add(pos, pluck(pulse_notes[step % len(pulse_notes)]), 0.30 if sec >= 70 else 0.20)

cycle_s = BEAT * 32 / SR
pos = 0
while pos < N:
    for f in [110, 130.8, 164.8]:
        add(pos, pad(f, cycle_s), 1.0)
    pos += int(cycle_s * SR)

peak = float(np.max(np.abs(out))) or 1.0
out = np.clip(out * (0.70 / peak), -1.0, 1.0)
pcm = (out * 32767).astype('<i2').tobytes()
with wave.open('/Users/henry/Desktop/hirecook-video/public/music.wav', 'wb') as wf:
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(SR)
    wf.writeframes(pcm)
print(f'Done — {DUR}s SaaS pulse at {BPM} BPM')
