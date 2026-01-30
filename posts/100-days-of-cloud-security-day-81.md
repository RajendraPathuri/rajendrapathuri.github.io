---
title: '100 Days of Cloud Security - Day 81: CICD Goat - PPE'
date: '2026-01-30'
author: 'Venkata Pathuri'
excerpt: 'Day 81 of my cloud security journey - CICD Goat - PPE'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 81: CICD Goat - PPE

## Overview
Welcome to Day 81 of our cloud security journey! Today, we’re diving into the world of Continuous Integration and Continuous Deployment (CI/CD) through the lens of Poisoned Pipeline Execution (PPE). This concept builds on our previous discussions about CI/CD security risks, particularly how misconfigured pipelines can be exploited. By understanding the vulnerabilities inherent in CI/CD processes, we can better protect our applications and sensitive data.

## Learning Objectives
In today's session, you will master how an attacker with only read permissions can exploit a CI/CD pipeline to execute malicious code. You’ll learn about the importance of stringent access controls and how to safeguard your CI/CD environments against such threats. By the end of this lesson, you'll be equipped with practical remediation strategies to ensure your pipelines are secure from unauthorized access.

## Deep Dive
### The Poisoned Pipeline Execution (PPE) Concept
Poisoned Pipeline Execution refers to a scenario where an attacker can inject malicious code into a CI/CD pipeline, leading to unauthorized actions within the deployment process. In our case, the attacker only has read permissions, which is a common scenario in many organizations. This limitation forces them to be creative in finding ways to exploit the system.

Imagine you have access to a repository called `Wonderland/caterpillar`. With only read permissions, you cannot directly push changes; however, you can **fork** the repository. This is a crucial step because forking allows you to create a personal copy of the repository where you can make modifications. 

### Step-by-Step Breakdown of the Attack
1. **Fork the Repository**: You create a fork of the `Wonderland/caterpillar` repository, allowing you to alter the code without affecting the original repository.
   
2. **Modify the `Jenkinsfile`**: In your fork, you edit the `Jenkinsfile` to include a payload that will execute during the pipeline run. Below is an example of what the malicious code might look like:

   ```groovy
   pipeline {
       agent any
       environment {
           PROJECT = "loguru"
           FLAG = credentials("flag1")
       }
       stages {
           stage ('Install_Requirements') {
               steps {
                   sh """
                       echo $FLAG | base64
                   """
               }
           }
   }
   ```

3. **Submit a Pull Request (PR)**: After modifying the `Jenkinsfile`, you submit a PR to the original repository. Since the CI/CD pipeline is misconfigured, it automatically trusts and executes the `Jenkinsfile` from your PR.

4. **Steal the Secret**: During the pipeline execution, your malicious command runs in the context of the CI system, allowing you to extract sensitive information, such as the `flag2` secret stored in the Jenkins Credential Store.

### Best Practices to Mitigate Risks
To prevent such vulnerabilities in your CI/CD process, here are some industry best practices:
- **Sandbox Testing**: Always test PRs from forks in a sandbox environment with restricted permissions. This minimizes the risk of exposing production secrets.
- **Thorough Code Review**: Conduct a rigorous review of key files like `Jenkinsfile`, `Makefile`, and GitHub workflows before merging any changes.
- **Manual Approval for External PRs**: Configure your CI pipeline to require manual approval for builds triggered by forks or external contributions. This adds an essential layer of scrutiny.

## Hands-On Practice
To put theory into practice, follow these steps in a controlled lab environment:
1. **Clone the `Wonderland/caterpillar` Repository**: 
   ```bash
   git clone https://github.com/Wonderland/caterpillar.git
   cd caterpillar
   ```

2. **Fork the Repository on GitHub**: Use GitHub’s UI to create a fork of the repository.

3. **Modify the `Jenkinsfile` in Your Fork**: Add the malicious payload, ensuring to keep it simple for testing.

4. **Create a Pull Request**: Submit the PR from your fork back to the original repository.

5. **Monitor the Pipeline Execution**: Watch the pipeline trigger and observe how your modifications affect the execution.

### Expected Outcomes
If the CI/CD pipeline is misconfigured, you’ll see the payload execute and potentially expose sensitive information. 

### Common Troubleshooting Tips
- If the pipeline fails, check your `Jenkinsfile` syntax for errors.
- Ensure that your GitHub repository settings allow PRs from forks.

## Key Takeaways
Today, we explored the concept of Poisoned Pipeline Execution and how even users with read permissions can exploit CI/CD pipelines if proper safeguards are not in place. By forking repositories and submitting PRs with malicious modifications, attackers can gain access to sensitive information. Implementing strict access controls, thorough code reviews, and manual approval processes are critical in defending against such vulnerabilities.

## Real-World Applications
In real-world environments, organizations must be vigilant about their CI/CD configurations. Misconfigured pipelines can lead to severe security breaches, resulting in data loss, financial damage, and reputational harm. By applying the lessons learned today, teams can build more resilient CI/CD systems that protect against unauthorized access and maintain the integrity of their deployment processes.

---
**Journey Progress:** 81/100 Days Complete 🚀