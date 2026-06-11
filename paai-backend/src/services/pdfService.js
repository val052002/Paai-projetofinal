import PDFDocument from 'pdfkit';

export function generateReportPdf(report, res) {
  const { audit, summary, by_domain, non_conformities } = report;
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="audit-${audit.id}-report.pdf"`);
  doc.pipe(res);

  const black = '#111111';
  const dark  = '#333333';
  const gray  = '#666666';
  const light = '#999999';
  const rule  = '#cccccc';
  const bg    = '#f5f5f5';
  const W     = 495;

  // ── Header ──
  doc.rect(0, 0, 595, 80).fill(bg);
  doc.fill(black).fontSize(20).font('Helvetica-Bold').text('PAAI', 50, 24);
  doc.fill(gray).fontSize(10).font('Helvetica').text('Relatório de Auditoria ISO 27001', 50, 50);
  doc.moveTo(50, 80).lineTo(545, 80).stroke(rule);

  // ── Audit title & meta ──
  doc.fill(black).fontSize(14).font('Helvetica-Bold').text(audit.title, 50, 100);
  doc.fill(gray).fontSize(9).font('Helvetica')
    .text(
      `${audit.company_name}  ·  ${audit.company_email}  ·  Início: ${new Date(audit.start_date).toLocaleDateString('pt-PT')}  ·  Estado: ${audit.status}`,
      50, 120, { width: W }
    );

  // ── Divider ──
  doc.moveTo(50, 140).lineTo(545, 140).stroke(rule);

  // ── Summary stats row ──
  const stats = [
    { label: 'Total de Controlos', value: String(summary.total) },
    { label: 'Avaliados',          value: String(summary.answered) },
    { label: 'Conformes',          value: String(summary.compliant) },
    { label: 'Não Conformidades',  value: String(summary.non_conformities) },
    { label: 'Taxa de Conformidade', value: `${summary.compliance_pct}%` },
  ];

  const boxW = 88;
  const boxH = 48;
  const by0  = 152;
  let bx = 50;

  for (const s of stats) {
    doc.rect(bx, by0, boxW, boxH).fill('#ffffff').stroke(rule);
    doc.fill(black).fontSize(16).font('Helvetica-Bold')
      .text(s.value, bx, by0 + 8, { width: boxW, align: 'center' });
    doc.fill(light).fontSize(7).font('Helvetica')
      .text(s.label, bx, by0 + 30, { width: boxW, align: 'center' });
    bx += boxW + 8;
  }

  // ── Compliance bar ──
  const barTop = by0 + boxH + 18;
  doc.fill(dark).fontSize(10).font('Helvetica-Bold').text('Visão Geral de Conformidade', 50, barTop);

  const barY = barTop + 16;
  doc.rect(50, barY, W, 10).fill('#e5e5e5');
  const fillW = Math.round((summary.compliance_pct / 100) * W);
  if (fillW > 0) doc.rect(50, barY, fillW, 10).fill('#222222');
  doc.fill(gray).fontSize(8).font('Helvetica')
    .text(
      `${summary.compliance_pct}% conforme  (${summary.compliant} de ${summary.answered} controlos avaliados)`,
      50, barY + 14, { width: W }
    );

  // ── By Domain ──
  const domainTop = barY + 36;
  doc.moveTo(50, domainTop - 4).lineTo(545, domainTop - 4).stroke(rule);
  doc.fill(dark).fontSize(10).font('Helvetica-Bold').text('Resultados por Domínio', 50, domainTop);

  let y = domainTop + 16;
  const domainOrder = ['Organizacional', 'Pessoas', 'Físico', 'Tecnológico'];

  for (const domain of domainOrder) {
    const d = by_domain[domain];
    if (!d) continue;
    const pct = d.total > 0 ? Math.round((d.compliant / d.total) * 100) : 0;

    doc.fill(dark).fontSize(9).font('Helvetica-Bold').text(domain, 50, y);
    doc.fill(gray).font('Helvetica').text(`${pct}%  (${d.compliant}/${d.total})`, 0, y, { align: 'right', width: 545 });

    const dBarY = y + 13;
    doc.rect(50, dBarY, W, 6).fill('#e5e5e5');
    const dFillW = Math.round((pct / 100) * W);
    if (dFillW > 0) doc.rect(50, dBarY, dFillW, 6).fill('#444444');

    y += 30;
  }

  // ── Non-Conformities ──
  y += 6;
  doc.moveTo(50, y).lineTo(545, y).stroke(rule);
  y += 10;

  if (non_conformities.length > 0) {
    if (y > 650) { doc.addPage(); y = 50; }
    doc.fill(dark).fontSize(10).font('Helvetica-Bold')
      .text(`Não Conformidades  (${non_conformities.length})`, 50, y);
    y += 18;

    for (const nc of non_conformities) {
      if (y > 690) { doc.addPage(); y = 50; }

      // control code + title
      doc.fill(dark).fontSize(9).font('Helvetica-Bold')
        .text(`${nc.codigo}`, 50, y, { continued: true });
      doc.fill(gray).font('Helvetica')
        .text(`  —  ${nc.titulo}`, { width: W });
      y = doc.y + 4;

      // observation
      if (nc.observation) {
        doc.fill(gray).fontSize(8).font('Helvetica-Bold').text('Observação:', 50, y);
        y = doc.y + 2;
        doc.fill(dark).font('Helvetica').text(nc.observation, 50, y, { width: W });
        y = doc.y + 4;
      }

      // recommendation
      doc.fill(gray).fontSize(8).font('Helvetica-Bold').text('Recomendação:', 50, y);
      y = doc.y + 2;
      doc.fill(dark).font('Helvetica').text(nc.recomendacao, 50, y, { width: W });
      y = doc.y + 10;

      // separator line between items
      doc.moveTo(50, y).lineTo(545, y).stroke('#eeeeee');
      y += 8;
    }
  } else {
    doc.fill(dark).fontSize(9).font('Helvetica')
      .text('Nenhuma não conformidade identificada. Conformidade total alcançada.', 50, y);
    y = doc.y;
  }

  // ── Footer ──
  doc.fill(light).fontSize(7.5).font('Helvetica')
    .text(
      `Gerado por PAAI  ·  ${new Date().toLocaleDateString('pt-PT')}`,
      50, 810, { align: 'center', width: W }
    );

  doc.end();
}
