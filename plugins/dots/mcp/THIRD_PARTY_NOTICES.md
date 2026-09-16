# Third-party and provenance notices

Portal source in this handoff is private/unpublished (`UNLICENSED` in package.json). No license or trademark availability is asserted for public distribution under the name Portal. No Commander source or assets were copied; its public archive was used read-only as a reference. UPSTREAM.md records the actual archive digest and absent execution-server checkout.

The project imports the official MCP TypeScript SDK, QuickJS/WASM, pg, ws, jose, Zod, TypeScript and Node type packages at the exact top-level versions declared in package.json. These packages and their transitive code/license files are **not bundled**. Network-disabled creation of this archive could not resolve a complete lockfile or audit the installed dependency trees. Installation/release review must preserve each dependency's LICENSE/NOTICE and generate a complete SBOM from the reviewed lock; do not treat this file as a completed license audit.

The independently written Python document worker uses lxml, pypdf, pypdfium2/PDFium, Pillow and ReportLab at versions listed in deploy/parser-requirements.txt. Test fixture generation additionally uses python-docx and openpyxl. No third-party wheel, shared library, font file or executable is redistributed in this source archive. Keep PDFium and other nested notices with provisioned environments and binary distributions. PyMuPDF is not a runtime dependency of Portal.

Generated fixture documents, pictures and source snippets are clearly synthetic test content. They are not the user's repository, real Steady screenshots or private documents. The inert VBA fixture is never executed and its bytes are used only to verify preservation/read-only format handling.
