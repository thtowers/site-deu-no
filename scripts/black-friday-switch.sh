#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Script de Gerenciamento da Campanha Black Friday — Site Deu Nó
# Uso:
#   ./scripts/black-friday-switch.sh status
#   ./scripts/black-friday-switch.sh publicar
#   ./scripts/black-friday-switch.sh restaurar-original
# ==============================================================================

BACKUP_TAG="pre-black-friday-backup"
ORIGINAL_COMMIT_FALLBACK="3887646" # Commit da versão original na main ("chore: marcar Pulseira Orvalho como indisponivel")

ACTION="${1:-status}"

case "$ACTION" in
  status)
    echo "============================================================"
    echo " Status da Campanha Black Friday — Deu Nó"
    echo "============================================================"
    echo "Branch atual : $(git branch --show-current)"
    echo "Commit main  : $(git rev-parse --short main 2>/dev/null || echo 'N/A')"
    if git rev-parse "$BACKUP_TAG" >/dev/null 2>&1; then
      echo "Tag backup   : $BACKUP_TAG ($(git rev-parse --short "$BACKUP_TAG"))"
    else
      echo "Tag backup   : ainda não criada (fallback: $ORIGINAL_COMMIT_FALLBACK)"
    fi
    echo ""
    echo "Virada automática no Front-End:"
    echo " - Ativa até : 15/11/2026 às 23:59:59 (Horário de Brasília)"
    echo " - Pós 16/11 : Volta sozinho para a versão original às 00:00:00"
    echo " - Preview   : ?preview=bf | ?preview=original"
    echo "============================================================"
    ;;

  publicar|ativar)
    echo "🚀 Preparando publicação da Black Friday na branch main..."
    git fetch origin main --tags || true

    # Cria tag de backup na versão original da main caso ainda não exista
    if ! git rev-parse "$BACKUP_TAG" >/dev/null 2>&1; then
      git tag -a "$BACKUP_TAG" main -m "Backup automático da versão original antes da Black Friday"
      echo "✅ Tag de segurança '$BACKUP_TAG' criada a partir da main."
    fi

    # Garante que estamos na branch black-friday e comita tudo caso haja alterações locais
    git checkout black-friday
    if [[ -n "$(git status --porcelain)" ]]; then
      git add -A
      git commit -m "feat(black-friday): publicar campanha oficial Black Friday (13, 14 e 15/11)"
    fi

    # Atualiza a main com a versão da Black Friday
    git checkout main
    git merge black-friday --no-edit
    git push origin main --tags
    echo "✅ Black Friday publicada em produção (origin/main)!"
    ;;

  restaurar-original|reverter)
    echo "🔄 Restaurando versão original do site na branch main..."
    git fetch origin main --tags || true

    TARGET_REF="$ORIGINAL_COMMIT_FALLBACK"
    if git rev-parse "$BACKUP_TAG" >/dev/null 2>&1; then
      TARGET_REF="$BACKUP_TAG"
    fi

    git checkout main
    git checkout "$TARGET_REF" -- .
    if [[ -n "$(git status --porcelain)" ]]; then
      git add -A
      git commit -m "chore(post-black-friday): restaurar versão original do site após encerramento da campanha"
      git push origin main
      echo "✅ Versão original restaurada e enviada para produção (origin/main)!"
    else
      echo "ℹ️ A branch main já está idêntica à versão original ($TARGET_REF)."
    fi
    ;;

  *)
    echo "Uso: $0 {status|publicar|restaurar-original}"
    exit 1
    ;;
esac
