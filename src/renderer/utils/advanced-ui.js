(function () {
  function bindAdvancedFeatureUI(deps = {}) {
    const {
      advancedDock,
      advancedToggleFab,
      advancedFabButtons = [],
      advancedPanels,
      getAdvancedQuickActionButton,
      markPanelInteraction,
      isAdvancedMenuExpanded,
      collapseAdvancedMenu,
      hideAllAdvancedPanels,
      scheduleAdvancedMenuAutoCollapse,
      expandAdvancedMenu,
      openAdvancedPanel,
      runWorkArrivalOneKey,
      clearAdvancedMenuAutoCollapseTimer,
      isAdvancedMenuExpandedFn,
      hasOpenAdvancedPanel,
      openExternalUrl,
      onControlAction,
      onControlBack,
      onControlBackMain,
      bindAdvancedPanelWindowDrag,
      bindAdvancedFeatureSecondaryActions,
      applyAdvancedFabIcons
    } = deps;

    if (!advancedDock || !advancedPanels) return;

    const handleAdvancedMenuToggleClick = () => {
      markPanelInteraction?.();
      if ((isAdvancedMenuExpandedFn || isAdvancedMenuExpanded)?.()) {
        collapseAdvancedMenu?.();
        hideAllAdvancedPanels?.();
      } else {
        expandAdvancedMenu?.();
      }
    };

    const handleAdvancedFabClick = (btn) => {
      const panelName = btn.dataset.panel;
      const isActive = btn.classList.contains('active');
      if (isActive) {
        hideAllAdvancedPanels?.();
        scheduleAdvancedMenuAutoCollapse?.();
        return;
      }
      openAdvancedPanel?.(panelName);
      clearAdvancedMenuAutoCollapseTimer?.();
    };

    const handleAdvancedControlPanelClick = (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const openUrlBtn = target.closest('[data-open-url]');
      if (openUrlBtn instanceof HTMLElement) {
        const url = openUrlBtn.dataset.openUrl;
        if (url) openExternalUrl?.(url);
        return;
      }
      const removeBtn = target.closest('[data-remove-link]');
      if (removeBtn instanceof HTMLElement) return;
      const controlBtn = target.closest('[data-control-action]');
      if (controlBtn instanceof HTMLElement) {
        onControlAction?.(controlBtn.dataset.controlAction || '');
        return;
      }
      if (target instanceof HTMLElement && target.matches('[data-control-back]')) {
        onControlBack?.();
        return;
      }
      if (target instanceof HTMLElement && target.matches('[data-control-back-main]')) {
        onControlBackMain?.();
      }
    };

    advancedToggleFab?.addEventListener('click', (event) => {
      event.stopPropagation();
      handleAdvancedMenuToggleClick();
    });

    advancedFabButtons.forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.stopPropagation();
        markPanelInteraction?.();
        handleAdvancedFabClick(btn);
      });
    });

    const workArrivalBtn = getAdvancedQuickActionButton?.();
    if (workArrivalBtn) {
      workArrivalBtn.addEventListener('click', async (event) => {
        event.stopPropagation();
        markPanelInteraction?.();
        collapseAdvancedMenu?.();
        await runWorkArrivalOneKey?.(workArrivalBtn);
      });
    }

    advancedDock.addEventListener('mouseenter', () => {});
    advancedDock.addEventListener('mouseleave', () => {
      if ((isAdvancedMenuExpandedFn || isAdvancedMenuExpanded)?.() && !(hasOpenAdvancedPanel?.())) {
        scheduleAdvancedMenuAutoCollapse?.();
      }
    });
    advancedDock.addEventListener('click', (event) => event.stopPropagation());
    advancedPanels.addEventListener('click', (event) => event.stopPropagation());
    advancedPanels.addEventListener('click', handleAdvancedControlPanelClick);

    bindAdvancedPanelWindowDrag?.({ advancedPanels, dragWindowBy: deps.dragWindowBy });
    bindAdvancedFeatureSecondaryActions?.({
      advancedDock,
      advancedPanels,
      markPanelInteraction,
      hideAllAdvancedPanels,
      expandPlannerPanel: deps.expandPlannerPanel,
      setInputMode: deps.setInputMode,
      generateWorkReviewText: deps.generateWorkReviewText,
      renderWorkReviewOutput: deps.renderWorkReviewOutput,
      showMessage: deps.showMessage,
      controlCenterBackBtn: deps.controlCenterBackBtn,
      controlCenterBackMainBtn: deps.controlCenterBackMainBtn,
      controlCenterAddBtn: deps.controlCenterAddBtn,
      controlCenterNameInput: deps.controlCenterNameInput,
      controlCenterUrlInput: deps.controlCenterUrlInput,
      controlCenterIconInput: deps.controlCenterIconInput,
      normalizeControlCenterUrl: deps.normalizeControlCenterUrl,
      saveControlCenterLinks: deps.saveControlCenterLinks,
      renderControlCenterLinks: deps.renderControlCenterLinks,
      setControlCenterPage: deps.setControlCenterPage,
      syncControlCenterInputs: deps.syncControlCenterInputs,
      CONTROL_CENTER_LINKS: deps.CONTROL_CENTER_LINKS,
      handleFabIconEdit: deps.handleFabIconEdit,
      openTrajectoryQuickAdd: deps.openTrajectoryQuickAdd,
      addCheckinV2Task: deps.addCheckinV2Task,
      addCheckinV2Countdown: deps.addCheckinV2Countdown,
      advancedDockContains: deps.advancedDockContains
    });
    applyAdvancedFabIcons?.();
  }

  function bindAdvancedPanelWindowDrag(deps = {}) {
    const { advancedPanels, dragWindowBy } = deps;
    if (!advancedPanels) return;
    let dragging = false;
    let lastScreenX = 0;
    let lastScreenY = 0;
    const shouldIgnoreDragTarget = (target) => target instanceof Element && Boolean(target.closest('button, input, select, textarea, a, [data-no-window-drag]'));
    const beginDrag = (event, head) => {
      if (event.button !== 0) return false;
      if (shouldIgnoreDragTarget(event.target)) return false;
      dragging = true; lastScreenX = event.screenX; lastScreenY = event.screenY; head.setPointerCapture?.(event.pointerId); event.preventDefault(); return true;
    };
    const updateDrag = (event) => { if (!dragging) return; const dx = event.screenX - lastScreenX; const dy = event.screenY - lastScreenY; if (dx === 0 && dy === 0) return; dragWindowBy?.(dx, dy); lastScreenX = event.screenX; lastScreenY = event.screenY; };
    const stopDrag = (event, head) => { if (!dragging) return; dragging = false; head.releasePointerCapture?.(event.pointerId); };
    advancedPanels.querySelectorAll('.adv-panel-head').forEach((head) => { head.addEventListener('pointerdown', (event) => beginDrag(event, head)); head.addEventListener('pointermove', updateDrag); head.addEventListener('pointerup', (event) => stopDrag(event, head)); head.addEventListener('pointercancel', (event) => stopDrag(event, head)); });
  }

  function bindAdvancedFeatureSecondaryActions(deps = {}) {
    const {
      advancedDock,
      advancedPanels,
      markPanelInteraction,
      hideAllAdvancedPanels,
      expandPlannerPanel,
      setInputMode,
      generateWorkReviewText,
      renderWorkReviewOutput,
      showMessage,
      controlCenterBackBtn,
      controlCenterBackMainBtn,
      controlCenterAddBtn,
      controlCenterNameInput,
      controlCenterUrlInput,
      controlCenterIconInput,
      normalizeControlCenterUrl,
      saveControlCenterLinks,
      renderControlCenterLinks,
      setControlCenterPage,
      syncControlCenterInputs,
      CONTROL_CENTER_LINKS,
      handleFabIconEdit,
      openTrajectoryQuickAdd,
      addCheckinV2Task,
      addCheckinV2Countdown,
      document: doc = document
    } = deps;

    advancedPanels?.querySelectorAll('[data-close-panel]').forEach((btn) => {
      btn.addEventListener('click', (event) => { event.preventDefault(); event.stopPropagation(); markPanelInteraction?.(); hideAllAdvancedPanels?.(); });
    });
    advancedPanels?.querySelectorAll('[data-icon-edit]').forEach((btn) => {
      btn.addEventListener('click', () => { markPanelInteraction?.(); const panel = btn.closest('.adv-panel')?.dataset.panel; if (!panel) return; const fab = advancedDock?.querySelector(`.adv-fab[data-panel="${panel}"]`); handleFabIconEdit?.(fab); });
    });
    deps.trajectoryAddBtn?.addEventListener('click', () => { markPanelInteraction?.(); openTrajectoryQuickAdd?.(); });
    deps.checkinV2AddTaskBtn?.addEventListener('click', (event) => { event.preventDefault(); event.stopPropagation(); markPanelInteraction?.(); addCheckinV2Task?.(); });
    deps.checkinV2TaskInput?.addEventListener('keydown', (event) => { if (event.key !== 'Enter') return; event.preventDefault(); event.stopPropagation(); markPanelInteraction?.(); addCheckinV2Task?.(); });
    deps.checkinV2AddCountdownBtn?.addEventListener('click', (event) => { event.preventDefault(); event.stopPropagation(); markPanelInteraction?.(); addCheckinV2Countdown?.(); });
    deps.checkinV2CountdownNameInput?.addEventListener('keydown', (event) => { if (event.key !== 'Enter') return; event.preventDefault(); event.stopPropagation(); markPanelInteraction?.(); addCheckinV2Countdown?.(); });
    deps.checkinV2CountdownDateInput?.addEventListener('keydown', (event) => { if (event.key !== 'Enter') return; event.preventDefault(); event.stopPropagation(); markPanelInteraction?.(); addCheckinV2Countdown?.(); });
    deps.workReviewBtn?.addEventListener('click', () => { markPanelInteraction?.(); renderWorkReviewOutput?.(generateWorkReviewText?.()); });
    deps.workReviewGenerateBtn?.addEventListener('click', () => { markPanelInteraction?.(); const text = generateWorkReviewText?.(); renderWorkReviewOutput?.(text); showMessage?.('复盘已生成。', 'chat'); });
    deps.workReviewCopyBtn?.addEventListener('click', async () => { markPanelInteraction?.(); const text = generateWorkReviewText?.(); renderWorkReviewOutput?.(text); try { await navigator.clipboard.writeText(text); showMessage?.('复盘内容已复制。', 'chat'); } catch { showMessage?.('复制失败，先手动选中。', 'chat'); } });
    controlCenterBackBtn?.addEventListener('click', () => { markPanelInteraction?.(); setControlCenterPage?.('main'); renderControlCenterLinks?.(); });
    controlCenterBackMainBtn?.addEventListener('click', () => { markPanelInteraction?.(); setControlCenterPage?.('main'); renderControlCenterLinks?.(); });
    controlCenterAddBtn?.addEventListener('click', () => {
      markPanelInteraction?.();
      const name = String(controlCenterNameInput?.value || '').trim();
      const url = normalizeControlCenterUrl?.(controlCenterUrlInput?.value || '');
      const icon = String(controlCenterIconInput?.value || '🔗').trim().slice(0, 2) || '🔗';
      if (!name || !url) { showMessage?.('名称和网址都要填。', 'chat'); return; }
      CONTROL_CENTER_LINKS?.push({ id: `link_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, name: name.slice(0, 16), url, icon });
      saveControlCenterLinks?.(); renderControlCenterLinks?.(); syncControlCenterInputs?.(); setControlCenterPage?.('web');
    });
    advancedPanels?.querySelectorAll('[data-open-legacy]').forEach((btn) => {
      btn.addEventListener('click', () => { markPanelInteraction?.(); const target = btn.dataset.openLegacy; expandPlannerPanel?.(); if (target === 'chat') setInputMode?.('chat'); if (target === 'reminder') setInputMode?.('task'); });
    });
    doc.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const clickedInsideDock = deps.advancedDockContains?.(target);
      const clickedInsidePanels = deps.advancedPanelsContains?.(target);
      if (!clickedInsideDock && !clickedInsidePanels) {
        deps.collapseAdvancedMenu?.();
        hideAllAdvancedPanels?.();
      }
    });
  }

  window.RendererAdvancedUiUtils = { bindAdvancedFeatureUI, bindAdvancedPanelWindowDrag, bindAdvancedFeatureSecondaryActions };
})();
