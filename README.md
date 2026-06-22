# 🍯 HoneyForge

## AI-Powered Deception & Honeypot Intelligence Platform

HoneyForge is an enterprise-grade deception platform designed to deploy, manage, monitor, and analyze web-based honeypots from a single unified interface.

The platform combines deception technology, threat intelligence, attack correlation, and AI-powered security analysis to help Security Operations Centers (SOCs) understand attacker behaviour and prioritize defensive actions.

Unlike traditional honeypot dashboards that simply collect logs, HoneyForge transforms attacker interactions into actionable intelligence through automated analysis, campaign detection, MITRE ATT&CK mapping, and technical recommendations.

---

# Key Features

* Enterprise SOC Dashboard
* Web Decoy Management
* Clone Studio for Decoy Creation
* Threat Intelligence Dashboard
* AI Intelligence Summary
* Review Queue & Analyst Workflow
* Live Attack Feed
* Detection Rule Management
* External Integrations
* Executive Reports
* Audit Logging
* Platform Settings
* Local Demo Mode
* Docker-Ready Deployment

---

# Documentation

| Guide | Description |
|---|---|
| [Local Setup Guide](docs/LOCAL_SETUP_GUIDE.md) | Clone, install, and run HoneyForge locally |
| [Supabase Setup](docs/SUPABASE_SETUP.md) | Configure authentication and PostgreSQL database |
| [Vercel Deployment](docs/VERCEL_DEPLOYMENT.md) | Deploy to Vercel for cloud hosting |
| [Architecture](docs/architecture.md) | Platform architecture and component overview |
| [Security Policy](SECURITY.md) | Vulnerability reporting and security guidelines |

Demo mode runs without any external services or API keys.

---

# Platform Objectives

HoneyForge is designed to help security teams:

* Detect attacks against deception assets
* Observe attacker behaviour safely
* Correlate attacks across multiple decoys
* Build attacker campaigns from related events
* Generate threat intelligence automatically
* Prioritize high-risk decoys
* Reduce analyst investigation time
* Improve SOC visibility
* Integrate with SIEM and Threat Intelligence platforms

---

# Platform Architecture

HoneyForge acts as the central intelligence layer between deception sensors and security operations.

Data can be collected from:

* SNARE
* TANNER
* Cowrie
* Dionaea
* Suricata
* OpenSearch
* Local Database
* Future third-party threat intelligence feeds

The collected events are normalized, correlated, enriched, and presented through AI-assisted dashboards.

For the full architecture diagram showing the sensor-to-output data flow, see [docs/architecture.md](docs/architecture.md).

---

# Navigation

## Dashboard

Provides a real-time overview of platform health and attack activity.

Includes:

* Total attacks
* Active decoys
* Critical alerts
* Pending reviews
* Malware attempts
* Attack trends
* Top attacker countries
* Top attack types
* Platform health
* Recent activity

---

## Decoys

Central management page for all deception assets.

Features:

* Create and manage decoys
* Risk scoring
* Status monitoring
* Health indicators
* Attack statistics
* Decoy lifecycle management

---

## Clone Studio

Clone Studio enables users to create web deception assets from approved internal applications.

Capabilities:

* Clone URL configuration
* Honeypot naming
* Attack profile selection
* Monitoring configuration
* Integration selection
* Decoy deployment workflow

Clone Studio is intended for defensive security testing and authorized deception scenarios only.

---

## Threat Intelligence

Aggregates indicators collected across all decoys.

Displays:

* IP addresses
* Domains
* URLs
* File hashes
* User agents
* Payload metadata
* Severity
* Confidence
* MITRE mappings
* IOC relationships

---

## AI Intelligence Summary

The AI Intelligence Summary module transforms collected telemetry into understandable intelligence.

Capabilities include:

### Cross-Decoy Correlation

Correlates related activity across multiple deception assets using:

* Source IP
* User-Agent
* Attack type
* Time window
* ASN
* Payload similarity
* MITRE technique

### Campaign Detection

Groups events into attacker campaigns such as:

* Credential harvesting
* SSH brute force
* Web exploitation
* Malware delivery
* Reconnaissance

### Decoy Risk Prioritization

Ranks decoys based on:

* Critical attacks
* Attack frequency
* Malware attempts
* Credential attempts
* Exposure level
* Business criticality

### Executive Summary

Generates management-friendly summaries explaining:

* Current threat landscape
* Highest risk assets
* Business impact
* Key recommendations

### Analyst Recommendations

Provides prioritized technical recommendations such as:

* Create detection rules
* Export IOCs
* Tune decoys
* Escalate incidents
* Forward events to SIEM
* Export to MISP

---

## Review Queue

Analyst investigation workspace.

Allows analysts to:

* Review suspicious events
* Confirm attacks
* Mark false positives
* Add comments
* Escalate incidents
* Export intelligence
* Trigger downstream actions

---

## Live Attack Feed

Provides a continuous stream of incoming honeypot activity.

Features:

* Live attack ticker
* Event timeline
* Attack details
* Source countries
* Top attacker IPs
* Campaign activity
* Payload metadata
* Event filtering

---

## Detection Rules

Detection engineering workspace.

Supports management of:

* Sigma metadata
* Suricata signatures
* Detection templates
* ATT&CK mappings
* Trigger statistics
* Rule lifecycle

---

## Integrations

HoneyForge is designed to integrate with external platforms.

Supported integrations include:

* OpenSearch
* Elasticsearch
* Splunk
* Microsoft Sentinel
* QRadar
* Chronicle
* MISP
* Slack
* Email
* Webhooks
* Jira
* ServiceNow

Current implementation provides configuration interfaces and integration-ready architecture.

---

## Reports

Executive and analyst reporting module.

Includes:

* Daily summary
* Weekly intelligence report
* Monthly executive report
* Decoy health report
* Threat trend analysis
* MITRE coverage report

Reports can be extended for scheduled delivery.

---

## Audit Logs

Records administrative and analyst actions.

Tracks:

* User login
* Configuration changes
* Decoy creation
* Review decisions
* Integration changes
* Report generation
* Rule modifications

Supports compliance and forensic investigations.

---

## Settings

Platform configuration center.

Includes:

* General settings
* Security configuration
* Detection settings
* Data retention
* Notifications
* User management
* System health
* Developer settings

---

# AI Intelligence Engine

HoneyForge includes a modular AI analysis layer.

The AI engine is designed to:

* Correlate events across decoys
* Identify attacker campaigns
* Prioritize decoys
* Generate executive summaries
* Produce analyst recommendations
* Map attacks to MITRE ATT&CK
* Prepare intelligence for SIEM and Threat Intelligence platforms

The architecture supports future integration with:

* OpenAI
* Anthropic Claude
* Ollama
* Local LLMs

Current implementation uses simulated intelligence until real telemetry sources are connected.

---

# Threat Intelligence Pipeline

Deception Sensors

↓

Event Collection

↓

Normalization

↓

Correlation

↓

IOC Extraction

↓

MITRE Mapping

↓

AI Analysis

↓

Review Queue

↓

SIEM / MISP / Slack / Reports

---

# Demo Mode

HoneyForge supports two operating modes.

### Demo Mode

Provides realistic simulated attacks and seeded data for demonstrations and development.

### Clean Mode

Starts with no events or decoys, allowing users to test real workflows and telemetry ingestion.

---

# Future Roadmap

* Real-time SNARE integration
* Real-time TANNER integration
* Cowrie event ingestion
* Dionaea malware metadata ingestion
* Suricata event ingestion
* OpenSearch connector
* MISP synchronization
* AI-powered campaign clustering
* IOC enrichment
* Automated detection rule generation
* AI-assisted SOC analyst workflows

---

# Security Notice

HoneyForge is a defensive security platform intended for authorized deception environments, research, SOC operations, and internal security testing.

It is not designed to perform offensive actions or unauthorized exploitation.

Users should deploy deception assets only within environments they own or are explicitly authorized to test.

---

# Technology Stack

Frontend

* Next.js
* TypeScript
* Tailwind CSS

Backend

* Next.js API Routes
* Local services
* REST architecture

Database

* PostgreSQL
* Supabase-compatible schema

Search

* OpenSearch (future integration)

Caching

* Redis

Deployment

* Docker Compose
* Local development
* Vercel-compatible

---

# Vision

HoneyForge aims to evolve beyond a traditional honeypot dashboard into an AI-powered deception intelligence platform that enables defenders to understand attacker behaviour, prioritize risk, and accelerate security operations through automation and actionable intelligence.