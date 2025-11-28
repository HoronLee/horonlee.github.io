---
layout: post
title: LVM添加硬盘并扩容至已有分区
date: 2024-05-28 16:34:48
tags: 
    - Linux
categories: 
    - 服务器运维
cover: https://tse4-mm.cn.bing.net/th/id/OIP-C.fc9kPEurw9LwPut0YMRC-QHaFF?rs=1&pid=ImgDetMain
password: 
hide: 
---

# LVM简介

LVM是 Logical Volume Manager（逻辑卷管理）的简写，它是Linux环境下对磁盘分区进行管理的一种机制。LVM将一个或多个磁盘分区（PV）虚拟为一个卷组（VG），相当于一个大的硬盘，我们可以在上面划分一些逻辑卷（LV）。当卷组的空间不够使用时，可以将新的磁盘分区加入进来。我们还可以从卷组剩余空间上划分一些空间给空间不够用的逻辑卷使用。

# 需求

虚拟机目前只有一块 40G 的硬盘，所以存储不够用了，需要扩容，但是 Ubuntu 使用的是 LVM 来管理硬盘，所以我们需要将添加的硬盘使用 LVM 卷管理来扩容存储空间。

## 添加硬盘

```bash
root@master:~# lsblk
NAME MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
loop0
       7:0    0 18.8M  1 loop /snap/k9s/155
loop1
       7:1    0 38.8M  1 loop /snap/snapd/21759
loop2
       7:2    0 63.9M  1 loop /snap/core20/2318
sr0   11:0    1 1024M  0 rom  
vda  252:0    0   40G  0 disk 
├─vda1
│    252:1    0    1M  0 part 
├─vda2
│    252:2    0    2G  0 part /boot
└─vda3
     252:3    0   38G  0 part 
  └─ubuntu--vg-ubuntu--lv
     253:0    0   88G  0 lvm  /var/lib/kubelet/pods/c0acc691-ab06-4573-aa64-98ac3aca0ad6/volume-subpaths/jenkins-pv-volume/jenkins/0
                              /var/lib/kubelet/pods/4359357c-5b61-4981-84e7-73271d1c88a5/volume-subpaths/tigera-ca-bundle/calico-kube-controllers/1
                              /var/lib/kubelet/pods/f48ab3ae-0eaa-44dd-97bd-4488c2b4def1/volume-subpaths/tigera-ca-bundle/calico-node/1
                              /var/lib/kubelet/pods/e7f67447-d801-4eb5-b78c-3dd4ff0e7c24/volume-subpaths/tigera-ca-bundle/calico-typha/1
                              /var/lib/kubelet/pods/c0acc691-ab06-4573-aa64-98ac3aca0ad6/volumes/kubernetes.io~local-volume/jenkins-pv-volume
                              /
vdb  252:16   0   50G  0 disk
```

可以看到我添加了一块硬盘`vdb`，拥有 50G 的空间

## 对新硬盘分区

这里我们使用 fdisk 工具来进行交互式分区

```bash
# fdisk /dev/vdb        #执行此命令，进行分区
Welcome to fdisk (util-linux 2.23.2).

Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Device does not contain a recognized partition table
Building a new DOS disklabel with disk identifier 0xdf09eb6a.

Command (m for help): p   #在此输入p

Disk /dev/vdb: 214.7 GB, 214748364800 bytes, 419430400 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk label type: dos
Disk identifier: 0xdf09eb6a

    Device Boot      Start         End      Blocks   Id  System

Command (m for help): n   #在此输入n
Partition type:
    p   primary (0 primary, 0 extended, 4 free)
    e   extended
Select (default p): p
Partition number (1-4, default 1): 1    #在此输入1
First sector (2048-419430399, default 2048):       #回车
Using default value 2048
Last sector, +sectors or +size{K,M,G} (2048-419430399, default 419430399):     #回车
Using default value 419430399
Partition 1 of type Linux and of size 200 GiB is set

Command (m for help): t   #在此输入t
Selected partition 1
Hex code (type L to list all codes): L     #在此输入L

  0  Empty           24  NEC DOS         81  Minix / old Lin bf  Solaris        
  1  FAT12           27  Hidden NTFS Win 82  Linux swap / So c1  DRDOS/sec (FAT-
  2  XENIX root      39  Plan 9          83  Linux           c4  DRDOS/sec (FAT-
  3  XENIX usr       3c  PartitionMagic  84  OS/2 hidden C:  c6  DRDOS/sec (FAT-
  4  FAT16 <32M      40  Venix 80286     85  Linux extended  c7  Syrinx         
  5  Extended        41  PPC PReP Boot   86  NTFS volume set da  Non-FS data    
  6  FAT16           42  SFS             87  NTFS volume set db  CP/M / CTOS / .
  7  HPFS/NTFS/exFAT 4d  QNX4.x          88  Linux plaintext de  Dell Utility   
  8  AIX             4e  QNX4.x 2nd part 8e  Linux LVM       df  BootIt         
  9  AIX bootable    4f  QNX4.x 3rd part 93  Amoeba          e1  DOS access     
  a  OS/2 Boot Manag 50  OnTrack DM      94  Amoeba BBT      e3  DOS R/O        
  b  W95 FAT32       51  OnTrack DM6 Aux 9f  BSD/OS          e4  SpeedStor      
  c  W95 FAT32 (LBA) 52  CP/M            a0  IBM Thinkpad hi eb  BeOS fs        
  e  W95 FAT16 (LBA) 53  OnTrack DM6 Aux a5  FreeBSD         ee  GPT            
  f  W95 Ext'd (LBA) 54  OnTrackDM6      a6  OpenBSD         ef  EFI (FAT-12/16/
10  OPUS            55  EZ-Drive        a7  NeXTSTEP        f0  Linux/PA-RISC b
11  Hidden FAT12    56  Golden Bow      a8  Darwin UFS      f1  SpeedStor      
12  Compaq diagnost 5c  Priam Edisk     a9  NetBSD          f4  SpeedStor      
14  Hidden FAT16 <3 61  SpeedStor       ab  Darwin boot     f2  DOS secondary  
16  Hidden FAT16    63  GNU HURD or Sys af  HFS / HFS+      fb  VMware VMFS    
17  Hidden HPFS/NTF 64  Novell Netware  b7  BSDI fs         fc  VMware VMKCORE 
18  AST SmartSleep  65  Novell Netware  b8  BSDI swap       fd  Linux raid auto
1b  Hidden W95 FAT3 70  DiskSecure Mult bb  Boot Wizard hid fe  LANstep        
1c  Hidden W95 FAT3 75  PC/IX           be  Solaris boot    ff  BBT            
1e  Hidden W95 FAT1 80  Old Minix      
Hex code (type L to list all codes): 8e      #输入lvm类型的hex代码
Changed type of partition 'Linux' to 'Linux LVM'

Command (m for help): p    #在此输入p

Disk /dev/vdb: 214.7 GB, 214748364800 bytes, 419430400 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk label type: dos
Disk identifier: 0xdf09eb6a

    Device Boot      Start         End      Blocks   Id  System
/dev/vdb1            2048   419430399   209714176   8e  Linux LVM

Command (m for help): w     #保存
The partition table has been altered!

Calling ioctl() to re-read partition table.
Syncing disks.
```

## 创建物理卷PV

通过 lsblk 可以看到vdb 硬盘已经有了一个 vdb1 的分区

```bash
vdb  252:16   0   50G  0 disk 
└─vdb1
```

接下来需要用这个分区创建一个物理卷

```bash
# pvcreate /dev/vdb1
  Physical volume "/dev/sdb1" successfully created.
```

 插卡看看你物理卷

```bash
root@master:~/kubevirt# pvdisplay 
  --- Physical volume ---
  PV Name               /dev/vda3
  VG Name               ubuntu-vg
  PV Size               <38.00 GiB / not usable 0   
  Allocatable           yes (but full)
  PE Size               4.00 MiB
  Total PE              9727
  Free PE               0
  Allocated PE          9727
  PV UUID               vbb5h2-G2mh-bxwo-Fvbu-YHMc-w0ox-j5tDU7
   
  "/dev/vdb1" is a new physical volume of "<50.00 GiB"
  --- NEW Physical volume ---	#这就是刚创建的物理卷
  PV Name               /dev/vdb1
  VG Name               
  PV Size               <50.00 GiB
  Allocatable           NO
  PE Size               0   
  Total PE              0
  Free PE               0
  Allocated PE          0
  PV UUID               ksuLmo-uwJI-olt3-w2qo-ZOIZ-IuPJ-ge4AFT
```

## 将物理卷PV加入卷组VG

查看卷组

```bash
root@master:~/kubevirt# vgdisplay 
  --- Volume group ---
  VG Name               ubuntu-vg	#卷组名
  System ID             
  Format                lvm2
  Metadata Areas        1
  Metadata Sequence No  2
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                1
  Open LV               1
  Max PV                0
  Cur PV                1
  Act PV                1
  VG Size               <38.00 GiB
  PE Size               4.00 MiB
  Total PE              9727
  Alloc PE / Size       9727 / <38.00 GiB
  Free  PE / Size       0 / 0   
  VG UUID               yYRukh-rHIp-EmtX-TePI-00i3-Aizq-ttSV8V
```

将新的分区/dev/vdb1加入到卷组中，这里的卷组名为ubuntu-vg

```
root@master:~/kubevirt# vgextend ubuntu-vg /dev/vdb1
  Volume group "ubuntu-vg" successfully extended
```

添加完成后再次查看卷组信息

```bash
root@master:~/kubevirt# vgdisplay 
  --- Volume group ---
  VG Name               ubuntu-vg
  System ID             
  Format                lvm2
  Metadata Areas        2
  Metadata Sequence No  3
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                1
  Open LV               1
  Max PV                0
  Cur PV                2
  Act PV                2
  VG Size               87.99 GiB
  PE Size               4.00 MiB
  Total PE              22526
  Alloc PE / Size       9727 / <38.00 GiB
  Free  PE / Size       12799 / <50.00 GiB
  VG UUID               yYRukh-rHIp-EmtX-TePI-00i3-Aizq-ttSV8V
```

## 扩容已有分区

下面是对现有分区进行逻辑卷扩容，我们这里根分区为40G，我们准备扩容根分区查看根分区的LV路径

```bash
root@master:~/kubevirt# df -h
Filesystem                         Size  Used Avail Use% Mounted on
tmpfs                              392M  4.1M  388M   2% /run
/dev/mapper/ubuntu--vg-ubuntu--lv   38G   21G   15G  59% /
tmpfs                              2.0G     0  2.0G   0% /dev/shm
tmpfs                              5.0M     0  5.0M   0% /run/lock
tmpfs                              2.0G     0  2.0G   0% /run/qemu
/dev/vda2                          2.0G  129M  1.7G   8% /boot
#省略...
```

扩容卷`/dev/mapper/ubuntu--vg-ubuntu--lv`

```bash
root@master:~/kubevirt# lvextend -l +100%FREE /dev/mapper/ubuntu--vg-ubuntu--lv
  Size of logical volume ubuntu-vg/ubuntu-lv changed from <38.00 GiB (9727 extents) to 87.99 GiB (22526 extents).
  Logical volume ubuntu-vg/ubuntu-lv successfully resized.
```

查看扩容后的逻辑卷大小

```bash
root@master:~/kubevirt# lvdisplay /dev/mapper/ubuntu--vg-ubuntu--lv
  --- Logical volume ---
  LV Path                /dev/ubuntu-vg/ubuntu-lv
  LV Name                ubuntu-lv
  VG Name                ubuntu-vg
  LV UUID                Tzdcm9-Z7YL-TmBZ-puFe-6e77-eB9X-F9Q3xo
  LV Write Access        read/write
  LV Creation host, time ubuntu-server, 2024-05-14 02:40:50 +0000
  LV Status              available
  # open                 1
  LV Size                87.99 GiB
  Current LE             22526
  Segments               2
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     256
  Block device           253:0
```

然后使用`resize2fs`进行在线调整xfs格式的文件系统大小

```bash
root@master:~# resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv
resize2fs 1.46.5 (30-Dec-2021)
Filesystem at /dev/mapper/ubuntu--vg-ubuntu--lv is mounted on /; on-line resizing required
old_desc_blocks = 5, new_desc_blocks = 11
The filesystem on /dev/mapper/ubuntu--vg-ubuntu--lv is now 23066624 (4k) blocks long.
```

最后查看下根分区的大小是否扩容成功

```bash
root@master:~# df -Th
Filesystem                        Type     Size  Used Avail Use% Mounted on
tmpfs                             tmpfs    392M  3.9M  388M   1% /run
/dev/mapper/ubuntu--vg-ubuntu--lv ext4      87G   21G   62G  26% /
tmpfs                             tmpfs    2.0G     0  2.0G   0% /dev/shm
tmpfs                             tmpfs    5.0M     0  5.0M   0% /run/lock
tmpfs                             tmpfs    2.0G     0  2.0G   0% /run/qemu
/dev/vda2                         ext4     2.0G  129M  1.7G   8% /boot
#省略...
```

可以看到已经完成了 LVM 卷的扩容！