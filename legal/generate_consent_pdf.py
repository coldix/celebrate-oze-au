#!/usr/bin/env python3
"""
Generate sensitive-content-consent.pdf for celebrate.oze.au
v2.0 — logo image, fixed header spacing, added Anniversary/Wedding,
        added Organiser field alongside Client fields.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor, grey, black, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable,
    Table, TableStyle, KeepTogether, Image
)
from reportlab.platypus.flowables import Flowable
from reportlab.lib import colors
import os

OUTPUT_PATH = "/Users/dixon/web/celebrate-oze-au/legal/sensitive-content-consent.pdf"
LOGO_PATH   = "/Users/dixon/web/celebrate-oze-au/images/oze-logo.webp"

BRAND_GREEN    = HexColor("#0e5c38")
LIGHT_GREY_BG  = HexColor("#f0f0f0")
TEXT_GREY      = HexColor("#555555")
MID_GREY       = HexColor("#888888")
UNDERLINE_GREY = HexColor("#aaaaaa")

MARGIN     = 1.5 * cm
PAGE_WIDTH = A4[0] - 2 * MARGIN   # usable width


class SectionHeading(Flowable):
    """A section heading with a light grey background bar."""

    def __init__(self, text, width):
        Flowable.__init__(self)
        self.text  = text
        self.width = width
        self.height = 18

    def draw(self):
        self.canv.setFillColor(LIGHT_GREY_BG)
        self.canv.rect(0, 0, self.width, self.height, fill=1, stroke=0)
        self.canv.setFillColor(BRAND_GREEN)
        self.canv.setFont("Helvetica-Bold", 10.5)
        self.canv.drawString(6, 4, self.text)


class SignatureLine(Flowable):
    """A label + long underline, with optional right-hand label+line."""

    def __init__(self, label, width, right_label=None, right_width=None):
        Flowable.__init__(self)
        self.label       = label
        self.width       = width
        self.right_label = right_label
        self.right_width = right_width or (width * 0.30)
        self.height      = 20

    def draw(self):
        c = self.canv
        c.setFont("Helvetica", 9)
        c.setFillColor(black)
        label_w = c.stringWidth(self.label, "Helvetica", 9)
        c.drawString(0, 6, self.label)

        if self.right_label:
            right_label_w  = c.stringWidth(self.right_label, "Helvetica", 9)
            left_line_end  = self.width - self.right_width - 12
            c.setStrokeColor(UNDERLINE_GREY)
            c.line(label_w + 4, 4, left_line_end, 4)
            rx = self.width - self.right_width
            c.setFillColor(black)
            c.drawString(rx, 6, self.right_label)
            c.setStrokeColor(UNDERLINE_GREY)
            c.line(rx + right_label_w + 4, 4, self.width, 4)
        else:
            c.setStrokeColor(UNDERLINE_GREY)
            c.line(label_w + 4, 4, self.width, 4)


class LabelFillLine(Flowable):
    """A label on the left, underline fill to the right edge."""

    def __init__(self, label, width):
        Flowable.__init__(self)
        self.label  = label
        self.width  = width
        self.height = 20

    def draw(self):
        c = self.canv
        c.setFont("Helvetica", 9.5)
        c.setFillColor(black)
        label_w = c.stringWidth(self.label, "Helvetica", 9.5)
        c.drawString(0, 5, self.label)
        c.setStrokeColor(UNDERLINE_GREY)
        c.line(label_w + 6, 3, self.width, 3)


class TwoColumnFillLine(Flowable):
    """Two label+underline fields side by side."""

    def __init__(self, left_label, right_label, width):
        Flowable.__init__(self)
        self.left_label  = left_label
        self.right_label = right_label
        self.width       = width
        self.height      = 20

    def draw(self):
        c = self.canv
        c.setFont("Helvetica", 9.5)
        c.setFillColor(black)
        col = self.width / 2 - 6

        # Left field
        lw = c.stringWidth(self.left_label, "Helvetica", 9.5)
        c.drawString(0, 5, self.left_label)
        c.setStrokeColor(UNDERLINE_GREY)
        c.line(lw + 6, 3, col, 3)

        # Right field
        rx = col + 12
        rw = c.stringWidth(self.right_label, "Helvetica", 9.5)
        c.setFillColor(black)
        c.drawString(rx, 5, self.right_label)
        c.setStrokeColor(UNDERLINE_GREY)
        c.line(rx + rw + 6, 3, self.width, 3)


class CheckboxLine(Flowable):
    """A row of checkbox options. Single long option wraps to multiple lines."""

    def __init__(self, options, width):
        Flowable.__init__(self)
        self.options = options
        self.width   = width
        # Taller if single long option (promo text)
        self.height  = 16 if len(options) > 1 else 28

    def draw(self):
        c = self.canv
        c.setFont("Helvetica", 9)
        x = 0
        for option in self.options:
            c.setStrokeColor(MID_GREY)
            c.setFillColor(white)
            c.rect(x, (self.height - 11) // 2, 9, 9, fill=1, stroke=1)
            c.setFillColor(black)
            # Wrap long text manually
            max_w = self.width - x - 14
            words = option.split()
            line, lines = "", []
            for word in words:
                test = (line + " " + word).strip()
                if c.stringWidth(test, "Helvetica", 9) <= max_w:
                    line = test
                else:
                    if line:
                        lines.append(line)
                    line = word
            if line:
                lines.append(line)
            line_h = 12
            y_start = (self.height // 2) + ((len(lines) - 1) * line_h / 2) - 3
            for i, ln in enumerate(lines):
                c.drawString(x + 14, y_start - i * line_h, ln)
            if len(self.options) > 1:
                x += c.stringWidth(option, "Helvetica", 9) + 22


def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        leftMargin=1.5 * cm,
        rightMargin=1.5 * cm,
        topMargin=1.4 * cm,
        bottomMargin=1.8 * cm,
    )

    story = []
    S = lambda n: Spacer(1, n)   # shorthand

    # ── HEADER ──────────────────────────────────────────────────────────────
    if os.path.exists(LOGO_PATH):
        try:
            logo = Image(LOGO_PATH, width=3.4 * cm, height=1.0 * cm)
            logo.hAlign = "LEFT"
            story.append(logo)
            story.append(S(2))
        except Exception:
            pass

    story.append(Paragraph(
        "Sensitive Content Consent &amp; Sign-off",
        ParagraphStyle("title", fontName="Helvetica-Bold", fontSize=14,
                       textColor=black, spaceAfter=2, leading=17)
    ))
    story.append(Paragraph(
        "For memorial, funeral, wake, anniversary, wedding and pages featuring children",
        ParagraphStyle("subtitle", fontName="Helvetica-Oblique", fontSize=8.5,
                       textColor=TEXT_GREY, spaceAfter=4, leading=11)
    ))
    story.append(HRFlowable(width="100%", thickness=1.2, color=BRAND_GREEN, spaceAfter=6))

    # ── SECTION 1 — PROJECT DETAILS ─────────────────────────────────────────
    story.append(Paragraph(
        "1.  Project Details",
        ParagraphStyle("s1head", fontName="Helvetica-Bold", fontSize=9.5,
                       textColor=BRAND_GREEN, spaceBefore=0, spaceAfter=3)
    ))

    story.append(TwoColumnFillLine("Client name:", "Organiser name:", PAGE_WIDTH))
    story.append(S(2))
    story.append(TwoColumnFillLine("Client email:", "Organiser email:", PAGE_WIDTH))
    story.append(S(2))
    story.append(TwoColumnFillLine("Client phone:", "Organiser phone:", PAGE_WIDTH))
    story.append(S(2))
    story.append(LabelFillLine('Event / page name (e.g. "Remembering Frank Dixon"):', PAGE_WIDTH))
    story.append(S(3))

    story.append(Paragraph(
        "Type of page:",
        ParagraphStyle("chklabel", fontName="Helvetica", fontSize=9, spaceAfter=2, spaceBefore=0)
    ))
    story.append(CheckboxLine(
        ["Memorial", "Funeral / Wake", "Anniversary", "Wedding"],
        PAGE_WIDTH
    ))
    story.append(S(2))
    story.append(CheckboxLine(
        ["Birthday (includes children)", "Retirement / Farewell", "Other:"],
        PAGE_WIDTH
    ))
    story.append(S(2))
    story.append(TwoColumnFillLine("If other, describe:", "Date:", PAGE_WIDTH))
    story.append(S(5))

    # ── SECTION 2 — CONTENT CONSENT ─────────────────────────────────────────
    story.append(SectionHeading("2.  Content Consent", PAGE_WIDTH))
    story.append(S(3))
    story.append(Paragraph(
        "By signing this form, I confirm that:",
        ParagraphStyle("intro", fontName="Helvetica", fontSize=9, spaceAfter=2)
    ))

    consent_items = [
        "I have the right to submit all photos, videos, names and other content provided for this project.",
        "I have obtained, or am entitled to give, consent on behalf of all identifiable individuals featured "
        "in submitted content, including any deceased persons and any children.",
        "I understand that content submitted will be published on a publicly accessible webpage hosted at celebrate.oze.au.",
        "I accept responsibility for the accuracy of all names, dates, stories, relationships and other factual details I have provided.",
        "I have read and agree to the celebrate.oze.au Terms of Service and Privacy Policy at celebrate.oze.au/legal/.",
    ]
    numbered_style = ParagraphStyle(
        "numbered", fontName="Helvetica", fontSize=9, leading=12,
        leftIndent=14, firstLineIndent=-14, spaceAfter=1,
    )
    for i, item in enumerate(consent_items, 1):
        story.append(Paragraph(f"{i}.  {item}", numbered_style))
    story.append(S(5))

    # ── SECTION 3 — PROMOTIONAL USE ─────────────────────────────────────────
    story.append(SectionHeading("3.  Optional: Portfolio & Promotional Permission", PAGE_WIDTH))
    story.append(S(3))
    story.append(Paragraph(
        "Entirely optional — you do not need to agree to this to use the service.",
        ParagraphStyle("promo_intro", fontName="Helvetica", fontSize=9, spaceAfter=3)
    ))
    promo_text = (
        "I agree that Celebrate may use selected parts of this project \u2014 including screenshots, "
        "design samples, approved images or short excerpts \u2014 for portfolio, demo, website, social media or print promotion."
    )
    story.append(CheckboxLine([promo_text], PAGE_WIDTH))
    story.append(S(2))
    story.append(Paragraph(
        "You may withdraw this permission at any time for future use by contacting us. "
        "It will not affect material already published or distributed.",
        ParagraphStyle("promonote", fontName="Helvetica-Oblique", fontSize=8,
                       textColor=MID_GREY, spaceAfter=5, leftIndent=14)
    ))

    # ── SECTION 4 — PAGE VISIBILITY ─────────────────────────────────────────
    story.append(SectionHeading("4.  Page Visibility", PAGE_WIDTH))
    story.append(S(3))
    story.append(Paragraph(
        "How should this page be accessible?",
        ParagraphStyle("vis_intro", fontName="Helvetica", fontSize=9, spaceAfter=3)
    ))
    story.append(CheckboxLine(
        ["Public (search engines, shareable link)", "Link only (not indexed)", "Password protected"],
        PAGE_WIDTH
    ))
    story.append(S(2))
    story.append(LabelFillLine("Page URL / link (if known):", PAGE_WIDTH))
    story.append(S(5))

    # ── SECTION 5 — SIGNATURE ───────────────────────────────────────────────
    story.append(SectionHeading("5.  Signature", PAGE_WIDTH))
    story.append(S(3))
    story.append(Paragraph(
        "To be signed by the person responsible for the content — the Client or the Organiser, "
        "not necessarily the person paying for the service.",
        ParagraphStyle("signote", fontName="Helvetica-Oblique", fontSize=8.5,
                       textColor=TEXT_GREY, spaceAfter=5)
    ))
    story.append(SignatureLine("Signed by (Client or Organiser):", PAGE_WIDTH,
                               right_label="Date:", right_width=PAGE_WIDTH * 0.28))
    story.append(S(5))
    story.append(SignatureLine("Print name:", PAGE_WIDTH))
    story.append(S(5))
    story.append(SignatureLine("Role (circle one):   Client  /  Organiser", PAGE_WIDTH))

    # ── FOOTER ──────────────────────────────────────────────────────────────
    def draw_footer(canvas, doc):
        canvas.saveState()
        canvas.setFont("Helvetica", 7)
        canvas.setFillColor(MID_GREY)
        y = 0.9 * cm
        canvas.drawCentredString(
            A4[0] / 2, y + 12,
            "Celebrate / OzOnLine  \u00b7  Colin Dixon  \u00b7  Mallacoota VIC  \u00b7  ABN 68 758 286 944"
        )
        canvas.drawCentredString(
            A4[0] / 2, y + 4,
            "celebrateozeau@gmail.com  \u00b7  0419 415 000  \u00b7  celebrate.oze.au"
        )
        canvas.setFont("Helvetica-Oblique", 6)
        canvas.drawCentredString(
            A4[0] / 2, y - 4,
            "Please return a signed copy by email to celebrateozeau@gmail.com. Retain a copy for your records."
        )
        canvas.restoreState()

    doc.build(story, onFirstPage=draw_footer, onLaterPages=draw_footer)
    print(f"PDF generated: {OUTPUT_PATH}")


if __name__ == "__main__":
    build_pdf()
