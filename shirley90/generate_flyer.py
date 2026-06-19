#!/usr/bin/env python3
"""Generate Shirley90 birthday celebration flyer — A6 PDF."""

import os
import tempfile
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

# ── Page size ──────────────────────────────────────────────────────────────────
PAGE_W = 297.6   # A6 width in points
PAGE_H = 419.5   # A6 height in points

# ── Brand colours ──────────────────────────────────────────────────────────────
PURPLE      = colors.HexColor('#3C3489')
MID_PURPLE  = colors.HexColor('#534AB7')
LIGHT_PURPLE= colors.HexColor('#EEEDFE')
PALE_PURPLE = colors.HexColor('#AFA9EC')
GOLD        = colors.HexColor('#BA7517')
DARK        = colors.HexColor('#1a1a2e')
LIGHT_GREY  = colors.HexColor('#f5f5f5')
WHITE       = colors.white

# ── Output path ────────────────────────────────────────────────────────────────
OUT = '/Users/dixon/web/celebrate-oze-au/shirley90/shirley90-flyer.pdf'


def hex_fill(c: canvas.Canvas, colour):
    """Set fill colour from a ReportLab colour object."""
    c.setFillColor(colour)


def draw_rect(c: canvas.Canvas, x, y, w, h, colour):
    """Draw a filled rectangle (y is bottom-left in points from page bottom)."""
    c.setFillColor(colour)
    c.rect(x, y, w, h, stroke=0, fill=1)


def centred_string(c: canvas.Canvas, text, y, font, size, colour):
    """Draw centred text at vertical position y."""
    c.setFont(font, size)
    c.setFillColor(colour)
    c.drawCentredString(PAGE_W / 2, y, text)


def make_qr(url: str, size_px: int = 300) -> str:
    """Generate a QR code PNG and return its temp file path."""
    import qrcode
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color='#3C3489', back_color='white')
    tmp = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
    img.save(tmp.name)
    tmp.close()
    return tmp.name


def build_pdf():
    c = canvas.Canvas(OUT, pagesize=(PAGE_W, PAGE_H))
    c.setTitle("Shirley Dixon Turns 90 — Celebration Flyer")
    c.setAuthor("celebrate.oze.au")

    # ── Section heights (from bottom) ─────────────────────────────────────────
    FOOTER_H  = 22
    QR_H      = 115
    DETAILS_H = 132
    HERO_H    = 100
    HEADER_H  = 80
    # Sanity: 22+115+132+100+80 = 449 — slightly over 419.5; we'll compress details.
    # Recalculate to fit exactly:
    DETAILS_H = PAGE_H - FOOTER_H - QR_H - HERO_H - HEADER_H  # 419.5-22-115-100-80 = 102.5
    # Let's use generous but fitting values:
    FOOTER_H  = 22
    QR_H      = 112
    HERO_H    = 100
    HEADER_H  = 82
    DETAILS_H = PAGE_H - FOOTER_H - QR_H - HERO_H - HEADER_H  # 103.5

    # Compute y-coordinates (bottom of each band)
    footer_y  = 0
    qr_y      = footer_y + FOOTER_H
    details_y = qr_y + QR_H
    hero_y    = details_y + DETAILS_H
    header_y  = hero_y + HERO_H   # = PAGE_H - HEADER_H

    # ── 5. FOOTER ─────────────────────────────────────────────────────────────
    draw_rect(c, 0, footer_y, PAGE_W, FOOTER_H, PURPLE)
    c.setFont('Helvetica', 7)
    c.setFillColor(WHITE)
    c.drawCentredString(PAGE_W / 2, footer_y + 8,
                        'A celebrate.oze.au event  ·  Colin Dixon  ·  0419 415 000')

    # ── 4. QR CODE SECTION ────────────────────────────────────────────────────
    draw_rect(c, 0, qr_y, PAGE_W, QR_H, LIGHT_GREY)

    qr_size = 72
    qr_path = make_qr('https://celebrate.oze.au/shirley90/')
    qr_img  = ImageReader(qr_path)

    qr_x = (PAGE_W - qr_size) / 2
    # Stack QR + two text lines, vertically centred in band
    total_qr_block = qr_size + 3 + 10 + 3 + 10  # ~98 — trim slightly
    total_qr_block = qr_size + 14 + 10
    block_start_y  = qr_y + (QR_H - total_qr_block) / 2  # bottom of block

    c.drawImage(qr_img, qr_x, block_start_y + 14 + 10, qr_size, qr_size,
                mask='auto')
    os.unlink(qr_path)

    c.setFont('Helvetica-Bold', 8)
    c.setFillColor(PURPLE)
    c.drawCentredString(PAGE_W / 2, block_start_y + 12,
                        'Scan for full details, RSVP & birthday wishes')

    c.setFont('Helvetica', 8)
    c.setFillColor(MID_PURPLE)
    c.drawCentredString(PAGE_W / 2, block_start_y + 1,
                        'celebrate.oze.au/shirley90')

    # ── 3. EVENT DETAILS ──────────────────────────────────────────────────────
    draw_rect(c, 0, details_y, PAGE_W, DETAILS_H, WHITE)

    PAD = 14
    BULLET_SIZE = 5
    LINE_H = 15.5
    TEXT_X = PAD + BULLET_SIZE + 7

    lines = [
        'Saturday 25 July 2026',
        'Noon to 5pm  ·  Afternoon tea 2–4pm',
        'Karbeethong Lodge, Mallacoota',
        '12 Schnapper Point Drive VIC 3892',
    ]

    # Position lines — start from top of band with top padding
    top_pad = 14
    line_start_y = details_y + DETAILS_H - top_pad - 9  # baseline of first line

    for i, line in enumerate(lines):
        by = line_start_y - i * LINE_H
        # Bullet square
        c.setFillColor(PURPLE)
        c.rect(PAD, by - 1, BULLET_SIZE, BULLET_SIZE, stroke=0, fill=1)
        # Text
        c.setFont('Helvetica', 10)
        c.setFillColor(DARK)
        c.drawString(TEXT_X, by, line)

    # Thin horizontal rule
    rule_y = line_start_y - (len(lines) - 1) * LINE_H - 10
    c.setStrokeColor(PALE_PURPLE)
    c.setLineWidth(0.75)
    c.line(PAD, rule_y, PAGE_W - PAD, rule_y)

    # Italic tagline
    c.setFont('Helvetica-Oblique', 9)
    c.setFillColor(MID_PURPLE)
    c.drawCentredString(PAGE_W / 2, rule_y - 13,
                        'Bring a plate to share — all welcome!')

    # ── 2. HERO AREA ──────────────────────────────────────────────────────────
    draw_rect(c, 0, hero_y, PAGE_W, HERO_H, LIGHT_PURPLE)

    # Large "90" numeral — vertically centred with "years young" below
    numeral_size = 72
    sub_size = 11
    gap = 4
    total_block = numeral_size + gap + sub_size
    numeral_baseline = hero_y + (HERO_H + total_block) / 2 - numeral_size + 4

    c.setFont('Helvetica-Bold', numeral_size)
    c.setFillColor(PURPLE)
    c.drawCentredString(PAGE_W / 2, numeral_baseline, '90')

    c.setFont('Helvetica-Oblique', sub_size)
    c.setFillColor(MID_PURPLE)
    c.drawCentredString(PAGE_W / 2, numeral_baseline - gap - sub_size + 2,
                        'years young')

    # ── 1. HEADER BAND ────────────────────────────────────────────────────────
    draw_rect(c, 0, header_y, PAGE_W, HEADER_H, PURPLE)

    # Top-right "celebrate.oze.au" label
    c.setFont('Helvetica-Bold', 9)
    c.setFillColor(WHITE)
    c.drawRightString(PAGE_W - 8, header_y + HEADER_H - 8 - 9, 'celebrate.oze.au')

    # Centred name — vertically position within band
    # Name + "Turns 90!" block centre
    name_size   = 28
    sub90_size  = 18
    block_gap   = 6
    total_name  = name_size + block_gap + sub90_size
    name_base   = header_y + (HEADER_H + total_name) / 2 - name_size + 6

    c.setFont('Helvetica-BoldOblique', name_size)
    c.setFillColor(WHITE)
    c.drawCentredString(PAGE_W / 2, name_base, 'Shirley Dixon')

    c.setFont('Helvetica-Bold', sub90_size)
    c.setFillColor(GOLD)
    c.drawCentredString(PAGE_W / 2, name_base - block_gap - sub90_size + 4,
                        'Turns 90!')

    # ── Save ─────────────────────────────────────────────────────────────────
    c.showPage()
    c.save()
    print(f'PDF saved: {OUT}')
    size = os.path.getsize(OUT)
    print(f'File size: {size:,} bytes ({size/1024:.1f} KB)')


if __name__ == '__main__':
    build_pdf()
