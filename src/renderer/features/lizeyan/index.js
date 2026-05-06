(function () {
  function bindLizeyanFeature(deps = {}) {
    const {
      characterTapArea,
      characterWrap,
      characterImg,
      characterGif,
      broomProp,
      quickInput,
      showMessage,
      pickOne,
      isPanelExpanded,
      getCharacterPointerActive,
      getCharacterDragging,
      getIdleActionTimer,
      setIdleActionTimer,
      getNextCareAt,
      setNextCareAt,
      getLastUserActivityAt,
      getIsActing,
      setIsActing,
      getPokeTimestamps,
      setPokeTimestamps,
      getInputMode,
      getFeishuModeEnabled,
      AVATAR_TOTAL,
      AVATAR_BASE,
      AVATAR_EXT,
      AVATAR_REFRESH_MS,
      AVATAR_SCALE_DEFAULT,
      AVATAR_SCALE_EXEMPT_INDEX,
      AVATAR_SCALE_LIFT_PX,
      AVATAR_DBL_VIDEO_MAP,
      IDLE_ACTION_INTERVAL_MS,
      CARE_MIN_MS,
      CARE_MAX_MS,
      CARE_AFTER_USER_IDLE_MS,
      CARE_MESSAGES,
      POKE_ANGRY_WINDOW_MS,
      POKE_ANGRY_THRESHOLD,
      setCharacterPointerActive,
      setCharacterDragging,
      setCharacterState,
      triggerIdleAction,
      stopCharacterGifPlayback,
      getCurrentAvatarIndex,
      getRandomAvatarIndex
    } = deps;

    const persona = window.RendererLizeyanPersona || {};
    const personaReplies = persona.CHAT_MAP || [];
    const personaFallbackReplies = persona.FALLBACK_REPLIES || [];

    function scheduleNextCare(from = Date.now()) {
      const span = CARE_MAX_MS - CARE_MIN_MS;
      const wait = CARE_MIN_MS + Math.random() * Math.max(1, span);
      setNextCareAt?.(from + wait);
    }

    function maybeSendCareMessage() {
      const now = Date.now();
      if ((getNextCareAt?.() || 0) <= 0) scheduleNextCare(now);
      if (now < (getNextCareAt?.() || 0)) return;
      if (now - (getLastUserActivityAt?.() || 0) < CARE_AFTER_USER_IDLE_MS) return;
      if (getCharacterPointerActive?.() || getCharacterDragging?.()) return;
      if (document.activeElement === quickInput) return;
      if (isPanelExpanded?.()) return;
      showMessage?.(pickOne?.(CARE_MESSAGES) || '', 'chat');
      scheduleNextCare(now);
    }

    function startIdleActions() {
      if (getIdleActionTimer?.()) clearInterval(getIdleActionTimer());
      setIdleActionTimer?.(setInterval(() => {
        if (getCharacterPointerActive?.() || getCharacterDragging?.()) return;
        if (isPanelExpanded?.() && document.activeElement === quickInput) return;
        maybeSendCareMessage();
        triggerIdleAction?.();
      }, IDLE_ACTION_INTERVAL_MS));
    }

    function isPokeAngryTriggered() {
      const now = Date.now();
      const filtered = (getPokeTimestamps?.() || []).filter((t) => now - t <= POKE_ANGRY_WINDOW_MS);
      filtered.push(now);
      setPokeTimestamps?.(filtered);
      return filtered.length >= POKE_ANGRY_THRESHOLD;
    }

    function getRandomAvatarIndexLocal(excludeIndex = -1) {
      let next = Math.floor(Math.random() * AVATAR_TOTAL) + 1;
      if (AVATAR_TOTAL > 1 && next === excludeIndex) next = (next % AVATAR_TOTAL) + 1;
      return next;
    }

    function getCurrentAvatarIndexLocal() {
      if (!characterImg) return 1;
      const src = characterImg.getAttribute('src') || '';
      const m = src.match(/形象(\d+)\.jpg$/);
      return m ? Number(m[1]) : 1;
    }

    function stopCharacterGifPlaybackLocal() {
      if (!characterWrap || !characterGif) return;
      characterWrap.classList.remove('playing-gif', 'video-zoom-2x', 'video-offset-down');
      characterGif.pause();
      characterGif.removeAttribute('src');
      characterGif.load();
    }

    function playAvatarDoubleTapGif() {
      if (!characterWrap || !characterGif || !characterImg) return false;
      const current = getCurrentAvatarIndexLocal();
      const candidateSources = AVATAR_DBL_VIDEO_MAP[current];
      if (!candidateSources?.length) return false;
      let sourceIndex = 0;
      let settled = false;
      const cleanupListeners = () => { characterGif.onerror = null; characterGif.onloadeddata = null; characterGif.onended = null; };
      const notifyPlaybackFailed = () => { showMessage?.('动作播放失败：可能不支持 webm/mov 编码。', 'chat'); };
      const tryPlayAt = () => {
        if (sourceIndex >= candidateSources.length) { cleanupListeners(); stopCharacterGifPlaybackLocal(); notifyPlaybackFailed(); return; }
        settled = false;
        const nextSrc = candidateSources[sourceIndex++];
        characterGif.src = nextSrc;
        characterWrap.classList.add('playing-gif');
        characterWrap.classList.toggle('video-offset-down', current === 1 || current === 2);
        characterWrap.classList.toggle('video-zoom-2x', current === 2);
        characterGif.currentTime = 0;
        characterGif.onerror = () => { if (settled) return; settled = true; tryPlayAt(); };
        characterGif.onloadeddata = () => {
          if (settled) return;
          settled = true;
          characterGif.onended = () => { cleanupListeners(); stopCharacterGifPlaybackLocal(); };
          const playPromise = characterGif.play();
          if (playPromise?.catch) playPromise.catch(() => { cleanupListeners(); tryPlayAt(); });
          window.setTimeout(() => { if (characterWrap.classList.contains('playing-gif')) { cleanupListeners(); stopCharacterGifPlaybackLocal(); } }, 15000);
        };
        characterGif.load();
        window.setTimeout(() => { if (settled) return; settled = true; tryPlayAt(); }, 900);
      };
      tryPlayAt();
      return true;
    }

    function refreshCharacterAvatar(force = false) {
      if (!characterImg) return;
      stopCharacterGifPlaybackLocal();
      const current = getCurrentAvatarIndexLocal();
      const nextIndex = force ? getRandomAvatarIndexLocal(-1) : getRandomAvatarIndexLocal(current);
      characterImg.src = `${AVATAR_BASE}${nextIndex}${AVATAR_EXT}`;
      characterImg.alt = `李泽言形象${nextIndex}`;
      characterImg.style.transformOrigin = 'center bottom';
      const isExempt = nextIndex === AVATAR_SCALE_EXEMPT_INDEX;
      characterImg.style.transform = isExempt ? 'scale(1)' : `scale(${AVATAR_SCALE_DEFAULT})`;
      if (characterWrap) characterWrap.style.marginTop = isExempt ? '' : `${2 - AVATAR_SCALE_LIFT_PX}px`;
    }

    return {
      scheduleNextCare,
      maybeSendCareMessage,
      startIdleActions,
      isPokeAngryTriggered,
      getCurrentAvatarIndex: getCurrentAvatarIndexLocal,
      getRandomAvatarIndex: getRandomAvatarIndexLocal,
      stopCharacterGifPlayback: stopCharacterGifPlaybackLocal,
      playAvatarDoubleTapGif,
      refreshCharacterAvatar
    };
  }

  window.RendererLizeyanFeature = { bindLizeyanFeature };
})();
